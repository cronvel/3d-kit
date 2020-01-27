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

/* global THREE */

//const tdk = require( './tdk.js' ) ;



// THREE.CubeGeometry with UV mapping depending on an upAxis ('x','y','z')
// facesFlags: bitmask, tell which face of the cube should be built (default=63 -> all faces)
function CubeGeometry( width , height , depth , widthSegments , heightSegments , depthSegments , upAxis , facesFlags ) {
	THREE.Geometry.call( this ) ;

	this.width = width ;
	this.height = height ;
	this.depth = depth ;

	this.widthSegments = widthSegments || 1 ;
	this.heightSegments = heightSegments || 1 ;
	this.depthSegments = depthSegments || 1 ;

	var halfWidth = this.width / 2 ;
	var halfHeight = this.height / 2 ;
	var halfDepth = this.depth / 2 ;

	// All faces
	this.facesFlags = facesFlags !== undefined ? facesFlags : 63 ;


	switch ( upAxis ) {
		case 'x' :
			this.buildPlane( 'y' , 'z' ,   1 , -1 , this.depth , this.height , halfWidth , 0 ) ; // px
			this.buildPlane( 'y' , 'z' ,   1 ,   1 , this.depth , this.height , -halfWidth , 1 ) ; // nx
			this.buildPlane( 'z' , 'x' ,   1 , -1 , this.width , this.depth , halfHeight , 2 ) ; // py
			this.buildPlane( 'z' , 'x' , -1 , -1 , this.width , this.depth , -halfHeight , 3 ) ; // ny
			this.buildPlane( 'y' , 'x' , -1 , -1 , this.width , this.height , halfDepth , 4 ) ; // pz
			this.buildPlane( 'y' , 'x' ,   1 , -1 , this.width , this.height , -halfDepth , 5 ) ; // nz
			break ;

		case 'z' :
			this.buildPlane( 'y' , 'z' ,   1 , -1 , this.depth , this.height , halfWidth , 0 ) ; // px
			this.buildPlane( 'y' , 'z' , -1 , -1 , this.depth , this.height , -halfWidth , 1 ) ; // nx
			this.buildPlane( 'x' , 'z' , -1 , -1 , this.width , this.depth , halfHeight , 2 ) ; // py
			this.buildPlane( 'x' , 'z' ,   1 , -1 , this.width , this.depth , -halfHeight , 3 ) ; // ny
			this.buildPlane( 'x' , 'y' ,   1 , -1 , this.width , this.height , halfDepth , 4 ) ; // pz
			this.buildPlane( 'x' , 'y' ,   1 ,   1 , this.width , this.height , -halfDepth , 5 ) ; // nz
			break ;

		case 'y' :	// jshint ignore:line
		default :
			this.buildPlane( 'z' , 'y' , -1 , -1 , this.depth , this.height , halfWidth , 0 ) ; // px
			this.buildPlane( 'z' , 'y' ,   1 , -1 , this.depth , this.height , -halfWidth , 1 ) ; // nx
			this.buildPlane( 'x' , 'z' ,   1 ,   1 , this.width , this.depth , halfHeight , 2 ) ; // py
			this.buildPlane( 'x' , 'z' ,   1 , -1 , this.width , this.depth , -halfHeight , 3 ) ; // ny
			this.buildPlane( 'x' , 'y' ,   1 , -1 , this.width , this.height , halfDepth , 4 ) ; // pz
			this.buildPlane( 'x' , 'y' , -1 , -1 , this.width , this.height , -halfDepth , 5 ) ; // nz
			break ;
	}


	//this.computeCentroids() ;
	this.mergeVertices() ;
}

module.exports = CubeGeometry ;

CubeGeometry.prototype = Object.create( THREE.Geometry.prototype ) ;
CubeGeometry.prototype.constructor = CubeGeometry ;



CubeGeometry.prototype.buildPlane = function( u , v , udir , vdir , width , height , depth , materialIndex )	{
	// If the flags for the current face doesn't match, the face is not created
	if ( ! ( this.facesFlags & ( 1 << materialIndex ) ) ) { return ; }

	var a , b , c , d , w , ix , iy ,
		vector , normal , face ,
		segmentWidth , segmentHeight ,
		gridX = this.widthSegments , gridX1 ,
		gridY = this.heightSegments , gridY1 ,
		halfWidth = width / 2 ,
		halfHeight = height / 2 ,
		offset = this.vertices.length ;

	if ( ( u === 'x' && v === 'y' ) || ( u === 'y' && v === 'x' ) ) {
		w = 'z' ;
	}
	else if ( ( u === 'x' && v === 'z' ) || ( u === 'z' && v === 'x' ) ) {
		w = 'y' ;
		gridY = this.depthSegments ;
	}
	else if ( ( u === 'z' && v === 'y' ) || ( u === 'y' && v === 'z' ) ) {
		w = 'x' ;
		gridX = this.depthSegments ;
	}

	gridX1 = gridX + 1 ;
	gridY1 = gridY + 1 ;
	segmentWidth = width / gridX ;
	segmentHeight = height / gridY ;
	normal = new THREE.Vector3() ;

	normal[ w ] = depth > 0 ? 1 : -1 ;

	for ( iy = 0 ; iy < gridY1 ; iy ++ ) {
		for ( ix = 0 ; ix < gridX1 ; ix ++ ) {
			vector = new THREE.Vector3() ;

			vector[ u ] = ( ix * segmentWidth - halfWidth ) * udir ;
			vector[ v ] = ( iy * segmentHeight - halfHeight ) * vdir ;
			vector[ w ] = depth ;

			this.vertices.push( vector ) ;
		}
	}

	for ( iy = 0 ; iy < gridY ; iy ++ ) {
		for ( ix = 0 ; ix < gridX ; ix ++ ) {
			a = ix + gridX1 * iy ;
			b = ix + gridX1 * ( iy + 1 ) ;
			c = ( ix + 1 ) + gridX1 * ( iy + 1 ) ;
			d = ( ix + 1 ) + gridX1 * iy ;

			// Face4 does not exist anymore...
			//face = new THREE.Face4( a + offset, b + offset, c + offset, d + offset ) ;

			face = new THREE.Face3( a + offset , b + offset , c + offset ) ;
			face.normal.copy( normal ) ;
			//face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone(), normal.clone() ) ;
			face.vertexNormals.push( normal.clone() , normal.clone() , normal.clone() ) ;
			face.materialIndex = materialIndex ;

			this.faces.push( face ) ;
			this.faceVertexUvs[ 0 ].push( [
				new THREE.Vector2( ix / gridX , 1 - iy / gridY ) ,
				new THREE.Vector2( ix / gridX , 1 - ( iy + 1 ) / gridY ) ,
				new THREE.Vector2( ( ix + 1 ) / gridX , 1 - ( iy + 1 ) / gridY )
				//new THREE.Vector2( ( ix + 1 ) / gridX, 1 - iy / gridY )
			] ) ;

			face = new THREE.Face3( a + offset , c + offset , d + offset ) ;
			//face = new THREE.Face3( d + offset , a + offset , c + offset ) ;
			face.normal.copy( normal ) ;
			face.vertexNormals.push( normal.clone() , normal.clone() , normal.clone() ) ;
			face.materialIndex = materialIndex ;

			this.faces.push( face ) ;
			this.faceVertexUvs[ 0 ].push( [
				new THREE.Vector2( ix / gridX , 1 - iy / gridY ) ,
				//new THREE.Vector2( ix / gridX, 1 - ( iy + 1 ) / gridY ),
				new THREE.Vector2( ( ix + 1 ) / gridX , 1 - ( iy + 1 ) / gridY ) ,
				new THREE.Vector2( ( ix + 1 ) / gridX , 1 - iy / gridY )
			] ) ;
		}
	}

} ;



