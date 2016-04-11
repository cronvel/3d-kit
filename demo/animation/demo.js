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



// standard global variables
var scene , camera , engine , controls = null ;
var keyboard = tdk.Keyboard() ;
var clock = new THREE.Clock() ;
// custom global variables
var cube ;
var pointLight , pointLightAngle = 0 , lightSphere ;
var animationMixer ;

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
	scene.add( pointLight ) ;
	
	
	
				/* AXIS HELPER */
	
	var axes = new THREE.AxisHelper( 200 ) ;
	scene.add( axes ) ;
	
	
	
				/* FLOOR */
	
	var floorTexture = new THREE.TextureLoader().load( '../tex/dirt-ground.jpg' ) ;
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping ; 
	floorTexture.anisotropy = 4 ;	// Anisotrope filtering for this texture
	floorTexture.repeat.set( 4 , 4 ) ;
	//var floorMaterial = new THREE.MeshLambertMaterial( { map: floorTexture , side: THREE.DoubleSide } ) ;
	var floorMaterial = tdk.Material.LambertPlusPlus( { map: floorTexture , side: THREE.DoubleSide } ) ;
	var floorGeometry = new THREE.PlaneGeometry( 1000 , 1000 , 4 , 4 ) ;
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
	
	var loader = new THREE.JSONLoader() ;
	var parsed ;
	
	//*
	parsed = loader.parse( require( '../models/slash.json' ) ) ;
	console.log( parsed ) ;
	
	// Enable skinning for each material, not sure why this does not work out of the box...
	parsed.materials.forEach( mat => mat.skinning = true ) ;
	
	var sword = new THREE.SkinnedMesh( parsed.geometry , new THREE.MeshFaceMaterial( parsed.materials ) ) ;
	animationMixer = new THREE.AnimationMixer( sword ) ;
	var slashAction = animationMixer.clipAction( parsed.geometry.animations[ 2 ] ) ;
	slashAction.setEffectiveWeight( 1 ) ;
	slashAction.play() ;
	
	sword.rotation.x = tdk.DEGREE_90 ;
	sword.position.z = 100 ;
	sword.scale.set( 20 , 20 , 20 ) ;
	scene.add( sword ) ;
	//*/
	
	
	// create a small sphere to show position of light
	lightSphere = new THREE.Mesh( 
		new THREE.SphereGeometry( 10 , 16 , 8 ) ,
		new THREE.MeshBasicMaterial( { color: 0xffaa00 } )
	) ;
	
	scene.add( lightSphere ) ;
	lightSphere.position.copy( pointLight.position ) ;
	
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
	
	var delta = clock.getDelta() ;
	if ( animationMixer ) { animationMixer.update( delta ); }
	
	pointLightAngle += 0.01 ;
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


