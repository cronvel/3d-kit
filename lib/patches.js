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



/*
	Monkey-patching Babylon to be Z-up ready, and other features.
*/



const Babylon = require( 'babylonjs' ) ;
const Quaternion = require( 'math-kit/lib/Quaternion.js' ) ;



function patch( object , property , value ) {
	if ( Object.getOwnPropertyDescriptor( object , property ) !== undefined || object[ property ] !== undefined ) {
		throw new Error( "Can't patch, property '" + property + "' already exists!" ) ;
	}

	object[ property ] = value ;
}



function patchAccessor( object , property , getter , setter ) {
	if ( Object.getOwnPropertyDescriptor( object , property ) !== undefined || object[ property ] !== undefined ) {
		throw new Error( "Can't patch, property '" + property + "' already exists!" ) ;
	}

	Object.defineProperty( object , property , {
		get: getter ,
		set: setter
	} ) ;
}



patch( Babylon.AbstractMesh.prototype , '_updateFromYawPitchRoll' , function() {
	if ( ! this.rotationQuaternion ) {
		this.rotationQuaternion = new Babylon.Quaternion() ;
	}

	this._yaw = this._yaw || 0 ;
	this._pitch = this._pitch || 0 ;
	this._roll = this._roll || 0 ;

	// Use my own quaternion implementation
	Quaternion.prototype.setEuler.call( this.rotationQuaternion , this._yaw , this._pitch , this._roll ) ;
} ) ;



patch( Babylon.AbstractMesh.prototype , 'yawPitchRoll' , function( yaw = 0 , pitch = 0 , roll = 0 ) {
	this._yaw = yaw ;
	this._pitch = pitch ;
	this._roll = roll ;
	this._updateFromYawPitchRoll() ;
} ) ;



patchAccessor( Babylon.AbstractMesh.prototype , 'yaw' ,
	function() {
		return this._yaw ;
	} ,
	function( value ) {
		if ( value === this._yaw ) { return ; }
		this._yaw = value ;
		this._updateFromYawPitchRoll() ;
	}
) ;



patchAccessor( Babylon.AbstractMesh.prototype , 'pitch' ,
	function() {
		return this._pitch ;
	} ,
	function( value ) {
		if ( value === this._pitch ) { return ; }
		this._pitch = value ;
		this._updateFromYawPitchRoll() ;
	}
) ;



patchAccessor( Babylon.AbstractMesh.prototype , 'roll' ,
	function() {
		return this._roll ;
	} ,
	function( value ) {
		if ( value === this._roll ) { return ; }
		this._roll = value ;
		this._updateFromYawPitchRoll() ;
	}
) ;

