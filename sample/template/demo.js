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



// standard global variables
var scene , camera ;
var canvas = document.getElementById( "renderCanvas" ) ;	// Get the canvas element
var engine = new BABYLON.Engine( canvas , true ) ;	// Generate the BABYLON 3D engine



function createScene() {

		/* SCENE */

	// Create the scene space
	scene = new BABYLON.Scene( engine ) ;
	
	// Important, because by default the coordinate system is like DirectX (left-handed) not like math and OpneGL (right-handed)
	scene.useRightHandedSystem = true ;



		/* CAMERA */

	// Add a camera to the scene and attach it to the canvas
	camera = new BABYLON.ArcRotateCamera( "Camera" , Math.PI / 2 , Math.PI / 2 , 2 , new BABYLON.Vector3(0,0,1) , scene ) ;
	
	// Make Z-axis the up vector
	camera.upVector = new BABYLON.Vector3( 0 , 0 , 1 ) ;	// Z-up
	
	// Make the canvas events control the camera
	camera.attachControl( canvas , true ) ;
	
	// Make the mouse wheel move less
	camera.wheelPrecision = 20 ;



		/* LIGHT */

	// Ambient light
	scene.ambientColor = new BABYLON.Color3( 0.5 , 0.5 , 0.5 ) ;
	
	// Add lights to the scene
	var pointLight = new BABYLON.PointLight( "pointLight" , new BABYLON.Vector3( -1 , -1 , 1 ) , scene ) ;
	//var light1 = new BABYLON.HemisphericLight( "light1" , new BABYLON.Vector3( 1 , 1 , 0 ) , scene ) ;



		/* FLOOR */

	var floorMaterial = new BABYLON.StandardMaterial( 'floorMaterial' , scene ) ;
	floorMaterial.diffuseTexture = new BABYLON.Texture( '../tex/dirt-ground.jpg' , scene ) ;
	//floorMaterial.specularColor = new BABYLON.Color3( 1,1,1 ) ;
	floorMaterial.specularColor = new BABYLON.Color3( 0,0,0 ) ;
	floorMaterial.ambientColor = new BABYLON.Color3( 0.5 , 0.5 , 0.5 ) ;
	//floorMaterial.ambientTexture = new BABYLON.Texture( '../tex/dirt-ground.jpg' , scene ) ;
	var floor = BABYLON.MeshBuilder.CreatePlane( "floor" , { size: 100 } , scene ) ;
	floor.material = floorMaterial ;
	floor.rotation.x = Math.PI ;
	
	// This is where you create and manipulate meshes
	var sphere = BABYLON.MeshBuilder.CreateSphere( "sphere" , {} , scene ) ;
	sphere.position.z = 1 ;

	var miniSphere = BABYLON.MeshBuilder.CreateSphere( "miniSphere" , { diameter: 0.5 } , scene ) ;
	miniSphere.position.z = 2 ;
}



function run() {
	createScene() ;

	// Register a render loop to repeatedly render the scene
	engine.runRenderLoop( () => {
		scene.render() ;
	} ) ;

	// Watch for browser/canvas resize events
	window.addEventListener( "resize" , () => {
		engine.resize() ;
	} ) ;
}

run() ;

