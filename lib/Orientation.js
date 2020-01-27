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



const tdk = require( './tdk.js' ) ;



// Orientation are rotation in a Direction, Elevation and Spin fashion.
function Orientation( object3d ) {
	this.object3d = object3d ;	// the Object3D references
	this.object3d.orientation = this ;

	this.direction = 0 ;	// -Y
	this.elevation = 0 ;	// X
	this.spin = 0 ;		// -Z

	// Origin matrix for 0,0,0 orientation, it set horizon and direction toward 'North'
	this.origin = new THREE.Matrix4() ;

	return this ;
}

module.exports = Orientation ;



Orientation.prototype.calibrateNorthHorizon = function() {
	this.object3d.up = new THREE.Vector3( 0 , 0 , 1 ) ;
	this.object3d.rotation.x = tdk.DEGREE_90 ;
	return this ;
} ;



Orientation.prototype.update = function() {
	this.object3d.matrix = this.object3d.matrix.multiplyMatrices(
		this.origin.setRotationFromEuler( this.object3d.rotation , this.object3d.eulerOrder ) ,
		this.object3d.matrix.setRotationFromEuler(
			new THREE.Vector3( this.elevation , -this.direction , -this.spin ) ,
			'YXZ'
		)
	).setPosition( this.object3d.position ) ;

	this.object3d.matrixAutoUpdate = false ;	// no update from euler/quaternion
	this.object3d.matrixWorldNeedsUpdate = true ;	// update world matrix or nothing will happend

	return this ;
} ;



Orientation.prototype.copy = function( orientation ) {
	this.direction = orientation.direction ;
	this.elevation = orientation.elevation ;
	this.spin = orientation.spin ;

	this.update() ;
} ;



Orientation.prototype.delete = function() {
	this.object3d.matrixAutoUpdate = true ;		// restore update from euler/quaternion
	this.object3d.matrixWorldNeedsUpdate = true ;

	// Orientation object will be garbage collected
	this.object3d.orientation = null ;
} ;


