#!/usr/bin/env node
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



const fs = require( 'fs' ) ;



async function cli() {
	var inputPath = process.argv[ 2 ] ,
		outputPath = process.argv[ 3 ] ;

	if ( ! inputPath ) {
		console.log( "Usage is ./flipYZ <input> [<output>]" ) ;
		return ;
	}
	
	var data = JSON.parse( await fs.promises.readFile( inputPath , 'utf8' ) ) ;
	
	if ( data._YZPatch ) {
		console.error( "Already patched!" ) ;
		process.exit( 1 ) ;
	}
	
	data.meshes.forEach( mesh => flipYZMesh( mesh ) ) ;
	
	data._YZPatch = true ;
	
	var json = JSON.stringify( data ) ;

	if ( outputPath ) {
		await fs.promises.writeFile( outputPath , json ) ;
	}
	else {
		console.log( json ) ;
	}
}



function flipYZMesh( mesh ) {
	flipYZArray( mesh.positions ) ;
	flipYZArray( mesh.normals ) ;
	flipFaceArray( mesh.indices ) ;
}



function flipYZArray( array ) {
	var tmp , i , iMax = array.length - 2 ;

	for ( i = 0 ; i < iMax ; i += 3 ) {
		tmp = array[ i + 1 ] ;
		array[ i + 1 ] = array[ i + 2 ] ;
		array[ i + 2 ] = tmp ;
	}
}



// We should also reverse face's vertex order (so backface culling will not break things)
function flipFaceArray( array ) {
	var tmp , i , iMax = array.length - 2 ;

	for ( i = 0 ; i < iMax ; i += 3 ) {
		tmp = array[ i ] ;
		array[ i ] = array[ i + 2 ] ;
		array[ i + 2 ] = tmp ;
	}
}



cli() ;

