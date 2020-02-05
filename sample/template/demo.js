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
const BABYLON = require( 'babylonjs' ) ;
require( 'babylonjs-loaders' ) ;	// No need to assign it, it's a plugin, it will modify BABYLON all by itself



// standard global variables
var scene , camera ;
var pointLightPosition ;
var cube , model ;
var canvas = document.getElementById( "renderCanvas" ) ;	// Get the canvas element
var engine = new BABYLON.Engine( canvas , true ) ;	// Generate the BABYLON 3D engine



async function createScene() {

	/* SCENE */

	// Create the scene space
	scene = new BABYLON.Scene( engine ) ;

	// Important, because by default the coordinate system is like DirectX (left-handed) not like math and OpneGL (right-handed)
	scene.useRightHandedSystem = true ;



	/* CAMERA */

	// Add a camera to the scene and attach it to the canvas
	camera = new BABYLON.ArcRotateCamera( "Camera" , Math.PI / 2 , Math.PI / 2 , 2 , new BABYLON.Vector3( 0 , 0 , 1 ) , scene ) ;

	// Make Z-axis the up vector
	camera.upVector = new BABYLON.Vector3( 0 , 0 , 1 ) ;	// Z-up

	// Make the canvas events control the camera
	camera.attachControl( canvas , true ) ;

	// Make the mouse wheel move less
	camera.wheelPrecision = 20 ;



	/* LIGHT */

	// Ambient light
	//scene.ambientColor = new BABYLON.Color3( 0.5 , 0.5 , 0.5 ) ;

	var hemisphericLight = new BABYLON.HemisphericLight( "hemisphericLight" , new BABYLON.Vector3( 0 , 0 , 1 ) , scene ) ;
	hemisphericLight.diffuse = new BABYLON.Color3( 0.5 , 0.5 , 0.5 ) ;
	hemisphericLight.specular = new BABYLON.Color3( 0 , 0 , 0 ) ;
	hemisphericLight.groundColor = new BABYLON.Color3( 0.2 , 0.1 , 0 ) ;

	// Add a point light to the scene
	pointLightPosition = new BABYLON.Vector3( 5 , 0 , 5 ) ;
	var pointLight = new BABYLON.PointLight( "pointLight" , pointLightPosition , scene ) ;
	pointLight.diffuse = new BABYLON.Color3( 0.5 , 0.5 , 0.4 ) ;
	pointLight.specular = new BABYLON.Color3( 0.5 , 0.5 , 0.5 ) ;

	// Add a physical sphere for the point light
	var pointLightSphere = BABYLON.MeshBuilder.CreateSphere( "pointLightSphere" , { diameter: 0.1 } , scene ) ;
	pointLightSphere.position = pointLightPosition ;
	pointLightSphere.material = new BABYLON.StandardMaterial( 'floorMaterial' , scene ) ;
	pointLightSphere.material.diffuseColor = new BABYLON.Color3( 0 , 0 , 0 ) ;
	pointLightSphere.material.specularColor = new BABYLON.Color3( 0 , 0 , 0 ) ;
	pointLightSphere.material.emissiveColor = new BABYLON.Color3( 1 , 1 , 0 ) ;



	/* SKY */

	var skybox = BABYLON.MeshBuilder.CreateBox( "skyBox" , { size: 1000 } , scene ) ;
	var skyboxMaterial = new BABYLON.StandardMaterial( "skyBox" , scene ) ;
	skyboxMaterial.backFaceCulling = false ;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture( "../textures/skybox" , scene ) ;
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE ;
	skyboxMaterial.diffuseColor = new BABYLON.Color3( 0 , 0 , 0 ) ;
	skyboxMaterial.specularColor = new BABYLON.Color3( 0 , 0 , 0 ) ;
	skybox.material = skyboxMaterial ;
	
	// Because I use Z-up but the skybox files are named for a Y-up system
	skybox.rotation.x = Math.PI / 2 ;



	/* FLOOR */

	// Create a Standard Material
	var floorMaterial = new BABYLON.StandardMaterial( 'floorMaterial' , scene ) ;

	// Add and scale the (diffuse) texture so it repeat 5 times
	floorMaterial.diffuseTexture = new BABYLON.Texture( '../textures/dirt-ground.jpg' , scene ) ;
	floorMaterial.diffuseTexture.uScale = floorMaterial.diffuseTexture.vScale = 5 ;

	// No specular for dirt ground
	//floorMaterial.specularColor = new BABYLON.Color3( 1 , 1 , 1 ) ;
	floorMaterial.specularColor = new BABYLON.Color3( 0 , 0 , 0 ) ;

	// Add some ambient, ambient will still use the diffuse texture as its base
	floorMaterial.ambientColor = new BABYLON.Color3( 0.5 , 0.5 , 0.5 ) ;
	//floorMaterial.ambientTexture = new BABYLON.Texture( '../textures/dirt-ground.jpg' , scene ) ;

	// Now create the ground plane
	var floor = BABYLON.MeshBuilder.CreatePlane( "floor" , { size: 100 } , scene ) ;
	floor.material = floorMaterial ;
	floor.rotation.x = Math.PI ;



	/* CUSTOM PART */

	// Create a Standard Material
	var brickMaterial = new BABYLON.StandardMaterial( 'brickMaterial' , scene ) ;

	// Add and scale the (diffuse) texture and fix default light
	brickMaterial.diffuseTexture = new BABYLON.Texture( '../textures/stone-wall.jpg' , scene ) ;
	brickMaterial.specularColor = new BABYLON.Color3( 0 , 0 , 0 ) ;
	brickMaterial.ambientColor = new BABYLON.Color3( 0.5 , 0.5 , 0.5 ) ;

	// Add bump mapping
	// Online tool to create normal map: https://www.smart-page.net/smartnormal/
	brickMaterial.bumpTexture = new BABYLON.Texture( '../textures/stone-wall.normal.png' , scene ) ;

	// Now create cube
	cube = BABYLON.MeshBuilder.CreateBox( "cube" , { size: 1 } , scene ) ;
	cube.material = brickMaterial ;
	cube.position.z = 1 ;
	cube.rotation.x = Math.PI ;
	
	// Test models
	var imported = await BABYLON.SceneLoader.ImportMeshAsync( "Sword" , "../models/sword.gltf" , null , scene ) ;
	console.log( "Imported:" , imported ) ;
	model = imported.meshes[ 0 ] ;
	model.position.z = 3 ;
}



async function run() {
	await createScene() ;

	var t = 0 , radius = 5 ;

	// Register a render loop to repeatedly render the scene
	engine.runRenderLoop( () => {
		pointLightPosition.x = radius * Math.cos( t ) ;
		pointLightPosition.y = radius * Math.sin( t ) ;
		pointLightPosition.z = 3 + 2 * Math.sin( t * 1.57 ) ;
		cube.rotation.z += 0.001 ;
		cube.rotation.x += 0.0004 ;
		model.rotation.z += 0.01 ;
		model.rotation.x += 0.004 ;
		scene.render() ;
		t += 0.01 ;
	} ) ;

	// Watch for browser/canvas resize events
	window.addEventListener( "resize" , () => {
		engine.resize() ;
	} ) ;
}

run() ;

