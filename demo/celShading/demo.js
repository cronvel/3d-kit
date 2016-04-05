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



var tdk = require( '../../lib/tdk.js' ) ;

var fs = require( 'fs' ) ;



// standard global variables
var scene , camera , engine , controls = null ;
var keyboard = tdk.Keyboard() ;
var clock = new THREE.Clock() ;
// custom global variables
var cube ;
var pointLight , pointLightAngle = 0 , lightSphere ;
var pointLight2 , pointLight2Angle = 0 , lightSphere2 ;

var enableLight2 = true ;



init() ;
animate() ;



function init() 
{
	// Scene
	scene = new THREE.Scene() ;
	
	// Engine
	engine = new tdk.Engine() ;
	engine.startAutoResize() ;
	engine.showFps() ;
	
	// Misc
	//THREEx.FullScreen.bindKey( { charCode : 'm'.charCodeAt(0) } ) ;
	
	
	
				/* CAMERA */
	
	camera = new THREE.PerspectiveCamera( 45 , 1 , 0.1 , 20000 ) ;
	scene.add( camera ) ;
	camera.position.set( 10 , -200 , 50 ) ;
	
	//*
	camera.up = new THREE.Vector3( 0 , 0 , 1 ) ;
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
	controls = new THREE.TrackballControls( camera ) ;
	
	
	
				/* LIGHT */
	
	// Ambient light
	var ambientLight = new THREE.AmbientLight( 0x555555 ) ;
	scene.add( ambientLight ) ;
	
	// Point light
	pointLight = new THREE.PointLight( 0xffffff ) ;
	pointLight.distance = 1000 ;
	pointLight.decay = 2 ;
	scene.add( pointLight ) ;
	
	// Point light2
	if ( enableLight2 )
	{
		pointLight2 = new THREE.PointLight( 0x00ff00 ) ;
		pointLight2.intensity = 0.3 ;
		pointLight2.distance = 1000 ;
		pointLight2.decay = 2 ;
		scene.add( pointLight2 ) ;
	}
	
	
				/* AXIS HELPER */
	
	var axes = new THREE.AxisHelper( 200 ) ;
	scene.add( axes ) ;
	
	
	
				/* FLOOR */
	
	var floorTexture = new THREE.TextureLoader().load( '../tex/dirt-ground.jpg' ) ;
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping ; 
	floorTexture.anisotropy = 4 ;	// Anisotrope filtering for this texture
	floorTexture.repeat.set( 4 , 4 ) ;
	
	//var floorMaterial = new THREE.MeshLambertMaterial( { map: floorTexture , side: THREE.DoubleSide } ) ;
	//var floorMaterial = tdk.Material.LambertPlusPlus( { map: floorTexture , side: THREE.DoubleSide , lights: true } ) ;
	//var floorMaterial = tdk.Material.Cel( { map: floorTexture , side: THREE.DoubleSide , lights: true } ) ;
	var floorMaterial = tdk.Material.Cel( {
		map: floorTexture ,
		side: THREE.DoubleSide ,
		lights: true ,
		specular: {
			intensity: 2,
			angle: 20
		}
	} ) ;
	
	var floorGeometry = new THREE.PlaneGeometry( 1000 , 1000 ) ;
	//var floorGeometry = new THREE.PlaneGeometry( 1000 , 1000 , 10 , 10 ) ;
	var floor = new THREE.Mesh( floorGeometry , floorMaterial ) ;
	floor.position.z = -60 ;
	scene.add( floor ) ;
	
	
	
				/* SKYBOX */
	
	var skyEntity = new tdk.SkyEntity().loadBox( '../tex/skybox' ) ;
	skyEntity.factor = 0.001 ;
	
	
	
				/* FOG */
	
	//scene.fog = new THREE.FogExp2( 0x9999ff , 0.00025 ) ;
	
	
	
	// Éléments actifs
	engine.activeScene( scene ) ;
	engine.activeCamera( camera ) ;
	engine.activeSkyEntity( skyEntity ) ;
	
	
	
	////////////
	// CUSTOM //
	////////////
	
	//*
	var loader = new THREE.JSONLoader() ;
	//console.log( require( './car.json' ) ) ;
	var parsed = loader.parse( require( './car.json' ) ) ;
	//console.log( parsed ) ;
	var modelGeometry = parsed.geometry ;
	var modelTexture = new THREE.TextureLoader().load( '../tex/wood-plank.jpg' ) ;
	modelTexture.anisotropy = 16 ;
	modelTexture.wrapS = THREE.RepeatWrapping ;
	modelTexture.wrapT = THREE.RepeatWrapping ;
	//var modelMaterial = new THREE.MeshLambertMaterial( { map: modelTexture } ) ;
	var modelMaterial = tdk.Material.Cel( {
		map: modelTexture ,
		lights: true ,
		specular: {
			intensity: 2,
			angle: 20
		}
	} ) ;
	
	var model = new THREE.Mesh( modelGeometry , modelMaterial ) ;
	//var model = new THREE.MeshFaceMaterial( modelGeometry , modelMaterial ) ;
	model.rotation.x = tdk.DEGREE_90 ;
	model.scale.set( 20 , 20 , 20 ) ;
	scene.add( model ) ;
	
	//var modelOutlineGeometry = modelGeometry.clone() ;
	//tdk.Geometry.dilate( modelOutlineGeometry , 0.2 ) ;
	//console.log( modelOutlineGeometry ) ;
	
	var modelOutline = new THREE.Mesh(
		tdk.Geometry.dilate( modelGeometry.clone() , 0.2 ) ,
		new THREE.MeshBasicMaterial( { color: 'black' , wireframe: true , side: THREE.BackSide } )
	) ;
	
	model.add( modelOutline ) ;
	
	model.rotation.x = tdk.DEGREE_90 ;
	model.scale.set( 20 , 20 , 20 ) ;
	scene.add( model ) ;
	//*/
	
	/*
	//var edges = new THREE.FaceNormalsHelper( model, 2, 0x00ff00, 1 );
	var edges = new THREE.VertexNormalsHelper( model, 2, 0x00ff00, 1 );
	scene.add( edges ) ;
	//*/
	
	
	//*
	var brickTexture = new THREE.TextureLoader().load( '../tex/stone-wall.jpg' ) ;
	brickTexture.anisotropy = 16 ;
	
	//var cubeMaterial = new THREE.MeshLambertMaterial( { map: brickTexture } ) ;
	//var cubeMaterial = tdk.Material.Cel( { map: brickTexture , lights: true } ) ;
	var cubeMaterial = tdk.Material.Cel( { map: brickTexture , lights: true } ) ;
	var cubeGeometry = new THREE.CubeGeometry( 50 , 50 , 50 ) ;
	
	cube = new THREE.Mesh( cubeGeometry , cubeMaterial ) ;
	//scene.add( cube ) ;
	
	var cubeOutlineGeometry = cubeGeometry.clone() ;
	tdk.Geometry.dilate( cubeOutlineGeometry , 0.2 ) ;
	console.log( cubeOutlineGeometry ) ;
	
	var cubeOutline = new THREE.Mesh(
		tdk.Geometry.dilate( cubeGeometry.clone() , 4 ) ,
		new THREE.MeshBasicMaterial( { color: 'black' , wireframe: true , side: THREE.BackSide } )
	) ;
	//cubeOutline.position = cube.position ;
	//Object.defineProperty( cubeOutline , 'position' , { value: cube.position , configurable: true } ) ;
	//console.log( Object.getOwnPropertyDescriptor( cubeOutline , 'position' ) ) ;
	//cubeOutline.position.set( 0 , -4 , 0 ) ;
	cube.add( cubeOutline ) ;
	cube.add( new THREE.VertexNormalsHelper( cube , 4 , 0x0000ff , 1 ) ) ;
	cube.add( new THREE.VertexNormalsHelper( cubeOutline , 4 , 0x00ff00 , 1 ) ) ;
	
	cube.position.set( 0 , -400 , 0 ) ;
	scene.add( cube ) ;
	
	//*/
	
	// create a small sphere to show position of light
	lightSphere = new THREE.Mesh( 
		new THREE.SphereGeometry( 10 , 16 , 8 ) ,
		new THREE.MeshBasicMaterial( { color: 0xffaa00 } )
	) ;
	
	scene.add( lightSphere ) ;
	lightSphere.position.copy( pointLight.position ) ;
	
	if ( enableLight2 )
	{
		// create a small sphere to show position of light
		lightSphere2 = new THREE.Mesh( 
			new THREE.SphereGeometry( 10 , 16 , 8 ) ,
			new THREE.MeshBasicMaterial( { color: 0x55ff55 } )
		) ;
		
		scene.add( lightSphere2 ) ;
		lightSphere2.position.copy( pointLight2.position ) ;
	}
	
	
	// Sprite
	var spriteTexture = new THREE.TextureLoader().load( '../tex/redball.png' );
	var spriteMaterial = new THREE.SpriteMaterial( { map: spriteTexture } ) ;
	var sprite = new THREE.Sprite( spriteMaterial ) ;
	sprite.position.set( -500 , 50 , 0 ) ;
	sprite.scale.set( 50 , 50 , 1.0 ) ;
	scene.add( sprite ) ;
	
}



function animate() 
{
	// Freeze rendering...
	if ( keyboard.pressed( [ 'p' ] ) ) { requestAnimationFrame( animate ) ; return ; }
	
	update() ;
	render() ;
	requestAnimationFrame( animate ) ;
}



function update()
{
	if ( controls )  { controls.update() ; }
	
	if ( camera.orientation )
	{
		camera.orientation.direction += 0.01 ;
		camera.orientation.update() ;
	}
	
	// Freeze object movements...
	if ( keyboard.pressed( [ 's' ] ) ) { return ; }
	
	
	cube.rotation.x += 0.003 ;
	cube.rotation.z += 0.001 ;
	
	
	pointLightAngle += 0.002 ;
	pointLight.position.set( 200 * Math.cos( pointLightAngle ) , 200 * Math.sin( pointLightAngle ) , 300 * ( 1 + Math.sin( pointLightAngle * 4 ) ) ) ;
	lightSphere.position.copy( pointLight.position ) ;
	
	if ( enableLight2 )
	{
		pointLight2Angle -= 0.001 ;
		pointLight2.position.set( 200 * Math.cos( pointLight2Angle ) , 200 * Math.sin( pointLight2Angle ) , 200 * ( 1 + Math.sin( pointLight2Angle * 2 ) ) ) ;
		lightSphere2.position.copy( pointLight2.position ) ;
	}
}



function render() 
{
	engine.render() ;
}


