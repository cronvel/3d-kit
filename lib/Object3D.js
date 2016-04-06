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



var tdk = require( './tdk.js' ) ;



var Object3D = {} ;
module.exports = Object3D ;



Object3D.outline = function outline( object , thickness , color )
{
	thickness = thickness || 1 ;
	color = color || 'black' ;
	
	console.log( object ) ;
	
	object.add( new THREE.Mesh(
		tdk.Geometry.dilate( object.geometry.clone() , 3 * thickness / ( object.scale.x + object.scale.y + object.scale.z ) ) ,
		new THREE.MeshBasicMaterial( { color: color , wireframe: false , side: THREE.BackSide } )
	) ) ;
	
	// Return the object, so it can be chained
	return object ;
} ;

