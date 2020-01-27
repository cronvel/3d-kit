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



const tdk = require( '../..' ) ;



// standard global variables
var scene , camera , engine , controls = null ;
var keyboard = new tdk.Keyboard() ;
var clock = new THREE.Clock() ;
// custom global variables
var cube ;
var pointLight , pointLightAngle = 0 , lightSphere ;

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
	var ambientLight = new THREE.AmbientLight( 0x333333 ) ;
	scene.add( ambientLight ) ;
	
	// Point light
	pointLight = new THREE.PointLight( 0xffffff ) ;
	scene.add( pointLight ) ;
	
	
	
				/* AXIS HELPER */
	
	var axes = new THREE.AxisHelper( 200 ) ;
	scene.add( axes ) ;
	
	
	
				/* FLOOR */
	
	var floorTexture = new THREE.TextureLoader().load( '../tex/checkerboard.jpg' ) ;
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping ; 
	floorTexture.repeat.set( 10 , 10 ) ;
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture , side: THREE.DoubleSide } ) ;
	var floorGeometry = new THREE.PlaneGeometry( 200 , 200 , 10 , 10 ) ;
	var floor = new THREE.Mesh( floorGeometry , floorMaterial ) ;
	floor.position.z = -60 ;
	scene.add( floor ) ;
	
	
	
				/* SKYBOX */
	
	//var skyEntity = new tdk.Sky_entity().load_box( '../tex/skybox' ) ;
	var skyEntity = new tdk.SkyEntity().loadDome( '../tex/sky2' , 'jpg' ) ;
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
	
	var crateTexture = new THREE.TextureLoader().load( '../tex/crate.png' ) ;
	var crateNormal = new THREE.TextureLoader().load( '../tex/crate.normal.png' ) ;
	
	var cubeMaterial = new THREE.MeshLambertMaterial( { map: crateTexture } ) ;
	var cubeMaterialBump = new THREE.MeshPhongMaterial( { map: crateTexture, bumpMap: crateNormal } ) ;
	
	var cubeGeometry = new THREE.CubeGeometry( 50 , 50 , 50 ) ;
	
	//cube = new THREE.Mesh( cubeGeometry , cubeMaterial ) ;
	cube = new THREE.Mesh( cubeGeometry , cubeMaterialBump ) ;
	cube.position.set( 0 , 0 , 0 ) ;
	scene.add( cube ) ;
	
	// create a small sphere to show position of light
	lightSphere = new THREE.Mesh( 
		new THREE.SphereGeometry( 10 , 16 , 8 ) ,
		new THREE.MeshBasicMaterial( { color: 0xffaa00 } )
	) ;
	
	scene.add( lightSphere ) ;
	lightSphere.position.copy( pointLight.position ) ;
	
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
