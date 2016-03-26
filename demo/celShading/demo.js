/*
	The Cedric's Swiss Knife (CSK) - CSK 3D toolbox

	Copyright (c) 2015 - 2016 Cédric Ronvel 
	
	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;



var three = require( 'three' ) ;
var tdk = require( '../../lib/tdk.js' ) ;

var fs = require( 'fs' ) ;



// standard global variables
var scene , camera , engine , controls = null ;
var keyboard = tdk.Keyboard() ;
var clock = new three.Clock() ;
// custom global variables
var cube ;
var pointLight , pointLightAngle = 0 , lightSphere ;




init() ;
animate() ;



function init() 
{
	// Scene
	scene = new three.Scene() ;
	
	// Engine
	engine = new tdk.Engine() ;
	engine.startAutoResize() ;
	engine.showFps() ;
	
	// Misc
	//THREEx.FullScreen.bindKey( { charCode : 'm'.charCodeAt(0) } ) ;
	
	
	
				/* CAMERA */
	
	camera = new three.PerspectiveCamera( 45 , 1 , 0.1 , 20000 ) ;
	scene.add( camera ) ;
	camera.position.set( 10 , -200 , 50 ) ;
	
	//*
	camera.up = new three.Vector3( 0 , 0 , 1 ) ;
	camera.lookAt( scene.position ) ;
	//*/
	
	/*
	new tdk.Orientation( camera ) ;
	camera.orientation.calibrateNorthHorizon() ;
	camera.orientation.direction = tdk.DEGREE_0 ;
	camera.orientation.elevation = - tdk.DEGREE_30 /2;
	camera.orientation.spin = tdk.DEGREE_0 ;
	//*/
	
	// Controls
	controls = new three.TrackballControls( camera ) ;
	
	
	
				/* LIGHT */
	
	// Ambient light
	var ambientLight = new three.AmbientLight( 0x555555 ) ;
	scene.add( ambientLight ) ;
	
	// Point light
	pointLight = new three.PointLight( 0xffffff ) ;
	scene.add( pointLight ) ;
	
	
	
				/* AXIS HELPER */
	
	var axes = new three.AxisHelper( 200 ) ;
	scene.add( axes ) ;
	
	
	
				/* FLOOR */
	
	var floorTexture = new three.TextureLoader().load( '../tex/dirt-ground.jpg' ) ;
	floorTexture.wrapS = floorTexture.wrapT = three.RepeatWrapping ; 
	floorTexture.anisotropy = 4 ;	// Anisotrope filtering for this texture
	floorTexture.repeat.set( 4 , 4 ) ;
	
	
	/*
	var floorMaterial = new three.MeshLambertMaterial( { map: floorTexture , side: three.DoubleSide } ) ;
	//three.ShaderLib['lambert'].fragmentShader = fs.readFileSync( __dirname + '/meshlambert_cel_a_frag.glsl' , 'utf8' ) ;
	//three.ShaderLib['lambert'].fragmentShader = fs.readFileSync( __dirname + '/meshlambert_cel_b_frag.glsl' , 'utf8' ) ;
	three.ShaderLib['lambert'].fragmentShader = fs.readFileSync( __dirname + '/meshlambert_cel_c_frag.glsl' , 'utf8' ) ;
	//*/
	
	//var floorMaterial = new three.MeshLambertMaterial( { map: floorTexture , side: three.DoubleSide } ) ;
	
	//*
	// Lambert material replication, hard to figure out, see:
	// http://stackoverflow.com/questions/21928178/replicating-meshlambertmaterial-using-shadermaterial-ignores-textures
	
	var defines = {};
	defines[ "USE_MAP" ] = "";
	
	var uniforms = three.UniformsUtils.merge( [
		three.UniformsLib[ "common" ],
		three.UniformsLib[ "aomap" ],
		three.UniformsLib[ "lightmap" ],
		three.UniformsLib[ "emissivemap" ],
		three.UniformsLib[ "fog" ],
		three.UniformsLib[ "lights" ],
		{
			"emissive" : { type: "c", value: new three.Color( 0x000000 ) }
		}
	] ) ;
	
	var shaderUniforms = three.UniformsUtils.clone( uniforms ) ;
	shaderUniforms[ "map" ].value = floorTexture;
	shaderUniforms[ "offsetRepeat" ].value.set( 0, 0, floorTexture.repeat.x, floorTexture.repeat.y );
	
	var floorMaterial = new three.ShaderMaterial( {
		name: "TerrainShader",
		defines     : defines,
		uniforms    : shaderUniforms,
		vertexShader: three.ShaderLib['lambert'].vertexShader ,
		//fragmentShader: three.ShaderLib['lambert'].fragmentShader ,
		fragmentShader: fs.readFileSync( __dirname + '/meshlambert_cel_c_frag.glsl' , 'utf8' ) ,
		side: three.DoubleSide ,
		fog:false,
		lights:true
	} ) ;
	//*/
	
	var floorGeometry = new three.PlaneGeometry( 1000 , 1000 , 10 , 10 ) ;
	var floor = new three.Mesh( floorGeometry , floorMaterial ) ;
	floor.position.z = -60 ;
	scene.add( floor ) ;
	
	
	
				/* SKYBOX */
	
	var skyEntity = new tdk.SkyEntity().loadBox( '../tex/skybox' ) ;
	skyEntity.factor = 0.001 ;
	
	
	
				/* FOG */
	
	//scene.fog = new three.FogExp2( 0x9999ff , 0.00025 ) ;
	
	
	
	// Éléments actifs
	engine.activeScene( scene ) ;
	engine.activeCamera( camera ) ;
	engine.activeSkyEntity( skyEntity ) ;
	
	
	
	////////////
	// CUSTOM //
	////////////
	
	var brickTexture = new three.TextureLoader().load( '../tex/stone-wall.jpg' ) ;
	brickTexture.anisotropy = 16 ;
	
	var cubeMaterial = new three.MeshLambertMaterial( { map: brickTexture } ) ;
	var cubeGeometry = new three.CubeGeometry( 50 , 50 , 50 ) ;
	
	cube = new three.Mesh( cubeGeometry , cubeMaterial ) ;
	cube.position.set( 0 , 0 , 0 ) ;
	scene.add( cube ) ;
	
	// create a small sphere to show position of light
	lightSphere = new three.Mesh( 
		new three.SphereGeometry( 10 , 16 , 8 ) ,
		new three.MeshBasicMaterial( { color: 0xffaa00 } )
	) ;
	
	scene.add( lightSphere ) ;
	lightSphere.position.copy( pointLight.position ) ;
	
	// Sprite
	var spriteTexture = new three.TextureLoader().load( '../tex/redball.png' );
	var spriteMaterial = new three.SpriteMaterial( { map: spriteTexture } ) ;
	var sprite = new three.Sprite( spriteMaterial ) ;
	sprite.position.set( -500 , 50 , 0 ) ;
	sprite.scale.set( 50 , 50 , 1.0 ) ;
	scene.add( sprite ) ;
	
}



function animate() 
{
	update() ;
	render() ;
	requestAnimationFrame( animate ) ;
}




function update()
{
	if ( keyboard.pressed( [ 'z' ] ) ) 
	{ 
		// do something
	}
	
	cube.rotation.x += 0.003 ;
	cube.rotation.z += 0.001 ;
	
	
	pointLightAngle += 0.002 ;
	pointLight.position.set( 200 * Math.cos( pointLightAngle ) , 200 * Math.sin( pointLightAngle ) , 200 * Math.sin( pointLightAngle / 100 ) ) ;
	lightSphere.position.copy( pointLight.position ) ;
	
	if ( controls )  { controls.update() ; }
	
	if ( camera.orientation )
	{
		camera.orientation.direction += 0.01 ;
		camera.orientation.update() ;
	}
}



function render() 
{
	engine.render() ;
}


