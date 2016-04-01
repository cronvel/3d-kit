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



//var tdk = require( './tdk.js' ) ;



// THREE.CubeGeometry with UV mapping depending on an upAxis ('x','y','z')
// facesFlags: bitmask, tell which face of the cube should be built (default=63 -> all faces)
function CubeGeometry( width, height, depth, widthSegments, heightSegments, depthSegments , upAxis , facesFlags )	// jshint ignore:line
{
	var self = this ;
	
	if ( ! ( self instanceof CubeGeometry ) ) { self = Object.create( CubeGeometry.prototype ) ; }
	
	THREE.Geometry.call( self ) ;
	
	self.width = width ;
	self.height = height ;
	self.depth = depth ;
	
	self.widthSegments = widthSegments || 1 ;
	self.heightSegments = heightSegments || 1 ;
	self.depthSegments = depthSegments || 1 ;
	
	var halfWidth = self.width / 2 ;
	var halfHeight = self.height / 2 ;
	var halfDepth = self.depth / 2 ;
	
	// All faces
	self.facesFlags = facesFlags !== undefined ? facesFlags : 63 ;
	
	
	switch ( upAxis )
	{
		case 'x' :
			self.buildPlane( 'y', 'z',   1, - 1, self.depth, self.height, halfWidth, 0 ) ; // px
			self.buildPlane( 'y', 'z',   1,   1, self.depth, self.height, - halfWidth, 1 ) ; // nx
			self.buildPlane( 'z', 'x',   1, - 1, self.width, self.depth, halfHeight, 2 ) ; // py
			self.buildPlane( 'z', 'x', - 1, - 1, self.width, self.depth, - halfHeight, 3 ) ; // ny
			self.buildPlane( 'y', 'x', - 1, - 1, self.width, self.height, halfDepth, 4 ) ; // pz
			self.buildPlane( 'y', 'x',   1, - 1, self.width, self.height, - halfDepth, 5 ) ; // nz
			break ;
			
		case 'z' :
			self.buildPlane( 'y', 'z',   1, - 1, self.depth, self.height, halfWidth, 0 ) ; // px
			self.buildPlane( 'y', 'z', - 1, - 1, self.depth, self.height, - halfWidth, 1 ) ; // nx
			self.buildPlane( 'x', 'z', - 1, - 1, self.width, self.depth, halfHeight, 2 ) ; // py
			self.buildPlane( 'x', 'z',   1, - 1, self.width, self.depth, - halfHeight, 3 ) ; // ny
			self.buildPlane( 'x', 'y',   1, - 1, self.width, self.height, halfDepth, 4 ) ; // pz
			self.buildPlane( 'x', 'y',   1,   1, self.width, self.height, - halfDepth, 5 ) ; // nz
			break ;
			
		case 'y' :	// jshint ignore:line
		default :
			self.buildPlane( 'z', 'y', - 1, - 1, self.depth, self.height, halfWidth, 0 ) ; // px
			self.buildPlane( 'z', 'y',   1, - 1, self.depth, self.height, - halfWidth, 1 ) ; // nx
			self.buildPlane( 'x', 'z',   1,   1, self.width, self.depth, halfHeight, 2 ) ; // py
			self.buildPlane( 'x', 'z',   1, - 1, self.width, self.depth, - halfHeight, 3 ) ; // ny
			self.buildPlane( 'x', 'y',   1, - 1, self.width, self.height, halfDepth, 4 ) ; // pz
			self.buildPlane( 'x', 'y', - 1, - 1, self.width, self.height, - halfDepth, 5 ) ; // nz
			break ;
	}
	
	
	//self.computeCentroids() ;
	self.mergeVertices() ;
	
	return self ;
}

module.exports = CubeGeometry ;



CubeGeometry.prototype = Object.create( THREE.Geometry.prototype ) ;



CubeGeometry.prototype.buildPlane = function buildPlane( u , v , udir , vdir , width , height , depth , materialIndex )	// jshint ignore:line
{
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
	
	if ( ( u === 'x' && v === 'y' ) || ( u === 'y' && v === 'x' ) )
	{
		w = 'z';
	}
	else if ( ( u === 'x' && v === 'z' ) || ( u === 'z' && v === 'x' ) )
	{
		w = 'y';
		gridY = this.depthSegments;
	}
	else if ( ( u === 'z' && v === 'y' ) || ( u === 'y' && v === 'z' ) )
	{
		w = 'x';
		gridX = this.depthSegments;
	}
	
	gridX1 = gridX + 1 ;
	gridY1 = gridY + 1 ;
	segmentWidth = width / gridX ;
	segmentHeight = height / gridY ;
	normal = new THREE.Vector3() ;
	
	normal[ w ] = depth > 0 ? 1 : - 1;
	
	for ( iy = 0; iy < gridY1; iy ++ )
	{
		for ( ix = 0; ix < gridX1; ix ++ )
		{
			vector = new THREE.Vector3() ;
			
			vector[ u ] = ( ix * segmentWidth - halfWidth ) * udir;
			vector[ v ] = ( iy * segmentHeight - halfHeight ) * vdir;
			vector[ w ] = depth;
			
			this.vertices.push( vector );
		}
	}
	
	for ( iy = 0 ; iy < gridY ; iy ++ )
	{
		for ( ix = 0 ; ix < gridX ; ix ++ )
		{
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
				new THREE.Vector2( ix / gridX, 1 - iy / gridY ),
				new THREE.Vector2( ix / gridX, 1 - ( iy + 1 ) / gridY ),
				new THREE.Vector2( ( ix + 1 ) / gridX, 1- ( iy + 1 ) / gridY ),
				//new THREE.Vector2( ( ix + 1 ) / gridX, 1 - iy / gridY )
			] ) ;
			
			face = new THREE.Face3( a + offset , c + offset , d + offset ) ;
			//face = new THREE.Face3( d + offset , a + offset , c + offset ) ;
			face.normal.copy( normal ) ;
			face.vertexNormals.push( normal.clone() , normal.clone() , normal.clone() ) ;
			face.materialIndex = materialIndex ;
			
			this.faces.push( face ) ;
			this.faceVertexUvs[ 0 ].push( [
				new THREE.Vector2( ix / gridX, 1 - iy / gridY ),
				//new THREE.Vector2( ix / gridX, 1 - ( iy + 1 ) / gridY ),
				new THREE.Vector2( ( ix + 1 ) / gridX, 1- ( iy + 1 ) / gridY ),
				new THREE.Vector2( ( ix + 1 ) / gridX, 1 - iy / gridY )
			] ) ;
		}
	}
	
} ;



