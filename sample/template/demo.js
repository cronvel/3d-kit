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
const Babylon = require( 'babylonjs' ) ;
require( 'babylonjs-loaders' ) ;	// No need to assign it, it's a plugin, it will modify BABYLON all by itself



// standard global variables
var scene , camera ;
var pointLightPosition = new Babylon.Vector3( 0 , 0 , 5 ) ;
var cube , gltfModel , babylonModel ;
var canvas = document.getElementById( "renderCanvas" ) ;	// Get the canvas element
var engine = new Babylon.Engine( canvas , true ) ;	// Generate the Babylon 3D engine



async function createScene() {

	/* SCENE */

	// Create the scene space
	scene = new Babylon.Scene( engine ) ;

	// Important, because by default the coordinate system is like DirectX (left-handed) not like math and OpneGL (right-handed)
	scene.useRightHandedSystem = true ;



	/* CAMERA */

	// Add a camera to the scene and attach it to the canvas
	camera = new Babylon.ArcRotateCamera( "Camera" , Math.PI / 2 , Math.PI / 2 , 2 , new Babylon.Vector3( 0 , 0 , 1 ) , scene ) ;

	// Make Z-axis the up vector
	camera.upVector = new Babylon.Vector3( 0 , 0 , 1 ) ;	// Z-up

	// Make the canvas events control the camera
	camera.attachControl( canvas , true ) ;

	// Make the mouse wheel move less
	camera.wheelPrecision = 20 ;



	/* AXIS SPHERES */
	
	var origin = Babylon.MeshBuilder.CreateSphere( "origin" , { diameter: 0.1 } , scene ) ;
	origin.position = new Babylon.Vector3( 0 , 0 , 0 ) ;
	origin.material = new Babylon.StandardMaterial( 'originMaterial' , scene ) ;
	origin.material.diffuseColor = new Babylon.Color3( 0 , 0 , 0 ) ;
	origin.material.specularColor = new Babylon.Color3( 0 , 0 , 0 ) ;
	origin.material.emissiveColor = new Babylon.Color3( 0 , 0 , 0 ) ;

	var xdir = Babylon.MeshBuilder.CreateSphere( "xdir" , { diameter: 0.1 } , scene ) ;
	xdir.position = new Babylon.Vector3( 1 , 0 , 0 ) ;
	xdir.material = new Babylon.StandardMaterial( 'xdirMaterial' , scene ) ;
	xdir.material.diffuseColor = new Babylon.Color3( 0 , 0 , 0 ) ;
	xdir.material.specularColor = new Babylon.Color3( 0 , 0 , 0 ) ;
	xdir.material.emissiveColor = new Babylon.Color3( 1 , 0 , 0 ) ;

	var ydir = Babylon.MeshBuilder.CreateSphere( "ydir" , { diameter: 0.1 } , scene ) ;
	ydir.position = new Babylon.Vector3( 0 , 1 , 0 ) ;
	ydir.material = new Babylon.StandardMaterial( 'ydirMaterial' , scene ) ;
	ydir.material.diffuseColor = new Babylon.Color3( 0 , 0 , 0 ) ;
	ydir.material.specularColor = new Babylon.Color3( 0 , 0 , 0 ) ;
	ydir.material.emissiveColor = new Babylon.Color3( 0 , 1 , 0 ) ;

	var zdir = Babylon.MeshBuilder.CreateSphere( "zdir" , { diameter: 0.1 } , scene ) ;
	zdir.position = new Babylon.Vector3( 0 , 0 , 1 ) ;
	zdir.material = new Babylon.StandardMaterial( 'zdirMaterial' , scene ) ;
	zdir.material.diffuseColor = new Babylon.Color3( 0 , 0 , 0 ) ;
	zdir.material.specularColor = new Babylon.Color3( 0 , 0 , 0 ) ;
	zdir.material.emissiveColor = new Babylon.Color3( 0 , 0 , 1 ) ;



	/* LIGHT */

	// Add ambient light
	//scene.ambientColor = new Babylon.Color3( 0.5 , 0.5 , 0.5 ) ;

	//* Add hemispheric light
	var hemisphericLight = new Babylon.HemisphericLight( "hemisphericLight" , new Babylon.Vector3( 0 , 0 , 1 ) , scene ) ;
	hemisphericLight.diffuse = new Babylon.Color3( 0.5 , 0.5 , 0.5 ) ;
	hemisphericLight.specular = new Babylon.Color3( 0.5 , 0.5 , 0.5 ) ;
	hemisphericLight.groundColor = new Babylon.Color3( 0.2 , 0.1 , 0 ) ;
	//*/

	/* Add spot light
	var spotLightPosition = new Babylon.Vector3( 2 , 5 , 9 ) ;
	var spotLightDirection = spotLightPosition.negate().normalize() ;
	var spotLight = new Babylon.SpotLight( "spotLight" , spotLightPosition , spotLightDirection , Math.PI / 3 , 1 , scene ) ;
	spotLight.diffuse = new Babylon.Color3( 0.5 , 0.5 , 0.5 ) ;
	spotLight.specular = new Babylon.Color3( 0.5 , 0.5 , 0.5 ) ;
	//spotLight.intensity = 1000 ;

	// Add the physical cone for the spot light
	var spotLightShape = {
		height: 0.4 ,
		diameter: 0.2 ,
		diameterTop: 0.1 ,
		enclose: true
	} ;
	var spotLightCone = Babylon.MeshBuilder.CreateCylinder( "spotLightCone" , spotLightShape , scene ) ;
	spotLightCone.position = spotLightPosition ;
	spotLightCone.lookAt( new Babylon.Vector3( 0 , 0 , 0 ) , 0 , - Math.PI / 2 ) ;
	spotLightCone.material = new Babylon.StandardMaterial( 'spotLightMaterial' , scene ) ;
	spotLightCone.material.diffuseColor = new Babylon.Color3( 0 , 0 , 0 ) ;
	spotLightCone.material.specularColor = new Babylon.Color3( 0 , 0 , 0 ) ;
	spotLightCone.material.emissiveColor = new Babylon.Color3( 1 , 1 , 0 ) ;
	//*/

	/* Add a directional light
	var directionalLight = new Babylon.DirectionalLight( "directionalLight" , new Babylon.Vector3( 0 , 0 , -1 ) , scene ) ;
	directionalLight.diffuse = new Babylon.Color3( 0.5 , 0.5 , 0.5 ) ;
	directionalLight.specular = new Babylon.Color3( 0.5 , 0.5 , 0.5 ) ;
	//*/

	//* Add the point light
	var pointLight = new Babylon.PointLight( "pointLight" , pointLightPosition , scene ) ;
	pointLight.diffuse = new Babylon.Color3( 0.6 , 0.6 , 0.6 ) ;
	pointLight.specular = new Babylon.Color3( 0.6 , 0.6 , 0.6 ) ;

	// Add the physical sphere for the point light
	var pointLightSphere = Babylon.MeshBuilder.CreateSphere( "pointLightSphere" , { diameter: 0.1 } , scene ) ;
	pointLightSphere.position = pointLightPosition ;
	pointLightSphere.material = new Babylon.StandardMaterial( 'pointLightMaterial' , scene ) ;
	pointLightSphere.material.diffuseColor = new Babylon.Color3( 0 , 0 , 0 ) ;
	pointLightSphere.material.specularColor = new Babylon.Color3( 0 , 0 , 0 ) ;
	pointLightSphere.material.emissiveColor = new Babylon.Color3( 1 , 1 , 0 ) ;
	//*/
	


	/* SKY */

	var skybox = Babylon.MeshBuilder.CreateBox( "skyBox" , { size: 1000 } , scene ) ;
	var skyboxMaterial = new Babylon.StandardMaterial( "skyBox" , scene ) ;
	skyboxMaterial.backFaceCulling = false ;
	skyboxMaterial.reflectionTexture = new Babylon.CubeTexture( "../textures/skybox" , scene ) ;
	skyboxMaterial.reflectionTexture.coordinatesMode = Babylon.Texture.SKYBOX_MODE ;
	skyboxMaterial.diffuseColor = new Babylon.Color3( 0 , 0 , 0 ) ;
	skyboxMaterial.specularColor = new Babylon.Color3( 0 , 0 , 0 ) ;
	skybox.material = skyboxMaterial ;
	
	// Because I use Z-up but the skybox files are named for a Y-up system
	skybox.rotation.x = Math.PI / 2 ;



	/* FLOOR */

	// Create a Standard Material
	var floorMaterial = new Babylon.StandardMaterial( 'floorMaterial' , scene ) ;

	// Add and scale the (diffuse) texture so it repeat 5 times
	floorMaterial.diffuseTexture = new Babylon.Texture( '../textures/dirt-ground.jpg' , scene ) ;
	floorMaterial.diffuseTexture.uScale = floorMaterial.diffuseTexture.vScale = 5 ;

	// No specular for dirt ground
	//floorMaterial.specularColor = new Babylon.Color3( 1 , 1 , 1 ) ;
	floorMaterial.specularColor = new Babylon.Color3( 0 , 0 , 0 ) ;

	// Add some ambient, ambient will still use the diffuse texture as its base
	floorMaterial.ambientColor = new Babylon.Color3( 0.5 , 0.5 , 0.5 ) ;
	//floorMaterial.ambientTexture = new Babylon.Texture( '../textures/dirt-ground.jpg' , scene ) ;

	// Now create the ground plane
	var floor = Babylon.MeshBuilder.CreatePlane( "floor" , { size: 100 } , scene ) ;
	floor.material = floorMaterial ;
	floor.rotation.x = Math.PI ;



	/* CUSTOM PART */

	// Create a Standard Material
	var brickMaterial = new Babylon.StandardMaterial( 'brickMaterial' , scene ) ;

	// Add and scale the (diffuse) texture and fix default light
	brickMaterial.diffuseTexture = new Babylon.Texture( '../textures/stone-wall.jpg' , scene ) ;
	brickMaterial.specularColor = new Babylon.Color3( 0 , 0 , 0 ) ;
	brickMaterial.ambientColor = new Babylon.Color3( 0.5 , 0.5 , 0.5 ) ;

	// Add bump mapping
	// Online tool to create normal map: https://www.smart-page.net/smartnormal/
	brickMaterial.bumpTexture = new Babylon.Texture( '../textures/stone-wall.normal.png' , scene ) ;

	// Now create cube
	cube = Babylon.MeshBuilder.CreateBox( "cube" , { size: 1 } , scene ) ;
	cube.material = brickMaterial ;
	cube.position = new Babylon.Vector3( 0 , 0 , 2 ) ;
	cube.rotation.x = Math.PI ;
	
	/* Test .glTF models
	var imported = await Babylon.SceneLoader.ImportMeshAsync( "Sword" , "../models/sword.gltf" , null , scene ) ;
	console.log( "Imported:" , imported ) ;
	gltfModel = imported.meshes[ 0 ] ;
	//gltfModel.position.z = 3 ;
	gltfModel.position = new Babylon.Vector3(0,0,0) ;
	gltfModel.rotation = new Babylon.Vector3(0,0,0) ;
	//*/

	//* Test .babylon models
	var imported = await Babylon.SceneLoader.ImportMeshAsync( "Sword" , "../models/sword.babylon" , null , scene ) ;
	console.log( "Imported:" , imported ) ;
	babylonModel = imported.meshes[ 0 ] ;
	//babylonModel.position = new Babylon.Vector3(0,0,0) ;
	//babylonModel.rotation = new Babylon.Vector3(0,0,0) ;
	//babylonModel.rotationQuaternion = new Babylon.Quaternion() ;
	babylonModel.position.z = 3 ;
	//babylonModel.roll = Math.PI / 2 ;
	//*/
}



async function run() {
	await createScene() ;

	var t = 0 , radius = 5 ;

	// Register a render loop to repeatedly render the scene
	engine.runRenderLoop( () => {
		pointLightPosition.x = radius * Math.cos( 0.7 * t ) ;
		pointLightPosition.y = radius * Math.sin( 0.7 * t ) ;
		pointLightPosition.z = 3 + 2 * Math.sin( 1.17 * t ) ;
		cube.rotation.z += 0.001 ;
		cube.rotation.x += 0.0004 ;
		
		/*
		gltfModel.rotation.z += 0.01 ;
		gltfModel.rotation.x += 0.004 ;
		//*/
		
		/*
		babylonModel.yaw += 0.01 ;
		//*/
		
		/*
		babylonModel.rotation.z += 0.01 ;
		//babylonModel.rotation.x += 0.004 ;
		//*/
		
		scene.render() ;
		t += 0.01 ;
	} ) ;

	// Watch for browser/canvas resize events
	window.addEventListener( "resize" , () => {
		engine.resize() ;
	} ) ;
}

run() ;

