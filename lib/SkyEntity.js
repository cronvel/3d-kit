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



function SkyEntity()
{
	var self = this ;
	
	if ( ! ( self instanceof SkyEntity ) ) { self = Object.create( SkyEntity.prototype ) ; }
	
	// Sky entity factor
	self.factor = 0 ;	// 0 : infinity sky
	
	// Entity scene
	self.internalScene = new THREE.Scene() ;
	
	// Skybox
	self.skybox = null ;
	
	// Entity camera (default values)
	self.internalCamera = new THREE.PerspectiveCamera( 45 , 1 , 1 , 10000 ) ;
	self.internalCamera.position.set( 0 , 0 , 0 ) ;
	self.internalCamera.up = new THREE.Vector3( 0 , 0 , 1 ) ;
	self.internalScene.add( self.internalCamera ) ;
	
	/*
	self.internalCamera.rotation.x = tdk.DEGREE_90 ;
	new tdk.Orientation( self.internalCamera ) ;
	
	// tmp:
	//*
	self.internalCamera.orientation.direction = tdk.DEGREE_90 ;
	self.internalCamera.orientation.elevation = tdk.DEGREE_0 ;
	self.internalCamera.orientation.spin = tdk.DEGREE_0 ;
	self.internalCamera.orientation.update() ;
	//*/
	
	// External stuff
	self.externalCamera = null ;
	
	return self ;
}

module.exports = SkyEntity ;



SkyEntity.prototype.loadBox = function loadBox( texture , extension , size )
{
	if ( extension === undefined )  { extension = 'png' ; }
	if ( size === undefined )  { size = 1000 ; }
	
	var materialList = [] ;
	
	materialList.push( new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( texture + '.xpos.' + extension ) } ) ) ;
	materialList.push( new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( texture + '.xneg.' + extension ) } ) ) ;
	materialList.push( new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( texture + '.ypos.' + extension ) } ) ) ;
	materialList.push( new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( texture + '.yneg.' + extension ) } ) ) ;
	materialList.push( new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( texture + '.zpos.' + extension ) } ) ) ;
	materialList.push( new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( texture + '.zneg.' + extension ) } ) ) ;
	
	for ( var i = 0 ; i < 6 ; i++ )
	{
		materialList[i].side = THREE.BackSide ;
	}
	
	var material = new THREE.MeshFaceMaterial( materialList ) ;
	
	// the size doesn't matter too much: the sky entity is rendered in another scene and depth buffer is cleared
	var geometry = new tdk.CubeGeometry( size , size , size , 1 , 1 , 1 , 'z' ) ;
	
	this.skybox = new THREE.Mesh( geometry , material ) ;
	this.internalScene.add( this.skybox ) ;
	
	return this ;
} ;



SkyEntity.prototype.loadDome = function loadDome( texture , extension , size )
{
	if ( extension === undefined )  { extension = 'png' ; }
	if ( size === undefined )  { size = 1000 ; }
	
	var material = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( texture + '.dome.' + extension ) } ) ;
	material.side = THREE.BackSide ;
	
	var geometry = new THREE.SphereGeometry( size , 16 , 8 , undefined , undefined , undefined , tdk.DEGREE_90 ) ;
	
	this.skybox = new THREE.Mesh( geometry , material ) ;
	
	this.skybox.rotation.x = tdk.DEGREE_90 ;
	this.skybox.position.z = - size / 10 ;
	
	this.internalScene.add( this.skybox ) ;
	
	return this ;
} ;



SkyEntity.prototype.setExternalCamera = function setExternalCamera( externalCamera )
{
	if ( ! ( externalCamera instanceof THREE.Object3D ) )
	{
		console.warn( 'This is not an Object3D' ) ;
		return this ;
	}
	
	this.externalCamera = externalCamera ;
	
	this.internalCamera.aspect = this.externalCamera.aspect ;
	this.internalCamera.fov = this.externalCamera.fov ;
	this.internalCamera.updateProjectionMatrix() ;
	
	return this ;
} ;



SkyEntity.prototype.update = function update()
{
	if ( ! this.externalCamera )  { return this ; }
	
	if ( this.factor )
	{
		this.internalCamera.position.copy( this.externalCamera.position ).multiplyScalar( this.factor ) ;
	}
	
	//this.internalCamera.useQuaternion = this.externalCamera.useQuaternion ;
	
	this.internalCamera.quaternion.copy( this.externalCamera.quaternion ) ;
	
	/*
	if ( this.internalCamera.useQuaternion )
	{
		this.internalCamera.quaternion.copy( this.externalCamera.quaternion ) ;
	}
	else
	{
		this.internalCamera.rotation.copy( this.externalCamera.rotation ) ;
		
		if ( this.externalCamera.orientation )
		{
			if ( ! this.internalCamera.orientation )  { new tdk.Orientation( this.internalCamera ) ; }
			this.internalCamera.orientation.copy( this.externalCamera.orientation ) ;
		}
		else if ( this.internalCamera.orientation )
		{
			this.internalCamera.orientation.delete() ;
		}
	}
	*/
	
	return this ;
} ;


