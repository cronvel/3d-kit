/*
	3D Kit

	Copyright (c) 2020 Cédric Ronvel

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



const Babylon = require( 'babylonjs' ) ;
//const math = require( 'math-kit' ) ;


const utils = {} ;
module.exports = utils ;



utils.createAxisMeshes = function( scene ) {
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
} ;

