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
var Stats = require( 'stats.js' ) ;



function Engine()
{
	var self = this ;
	
	if ( ! ( self instanceof Engine ) ) { self = Object.create( Engine.prototype ) ; }
	
	// Creating Three.js renderer
	self.renderer = new THREE.WebGLRenderer( { antialias : true } ) ;
	
	
	// Create some domElement...
	self.container = document.createElement( 'div' ) ;
	document.body.appendChild( self.container ) ;
	self.container.appendChild( self.renderer.domElement ) ;
	
	self.scene = null ;
	self.camera = null ;
	self.skyEntity = null ;
	
	self.fpsStats = null ;
	
	// Renderer options
	self.renderer.setClearColor( 0x000000 , 1 ) ;	// Auto-clear color and alpha
	self.renderer.autoClear = false ;			// Disable auto-clearing, we will do it manually
	
	self.resizeToContainer() ;
	
	return self ;
}

module.exports = Engine ;



Engine.prototype.activeScene = function activeScene( scene )
{
	this.scene = scene ;
	return this ;
} ;



Engine.prototype.activeCamera = function activeCamera( camera )
{
	this.camera = camera ;
	this.camera.aspect = this.aspect ;
	this.camera.updateProjectionMatrix() ;
	if ( this.skyEntity )  { this.skyEntity.setExternalCamera( this.camera ) ; }
	return this ;
} ;



Engine.prototype.activeSkyEntity = function activeSkyEntity( skyEntity )
{
	this.skyEntity = skyEntity ;
	if ( this.camera )  { this.skyEntity.setExternalCamera( this.camera ) ; }
	return this ;
} ;



Engine.prototype.showFps = function showFps()
{
	this.fpsStats = new Stats() ;
	this.fpsStats.domElement.style.position = 'absolute' ;
	this.fpsStats.domElement.style.bottom = '0px' ;
	this.fpsStats.domElement.style.zIndex = 100 ;
	this.container.appendChild( this.fpsStats.domElement ) ;
} ;



Engine.prototype.render = function render()
{
	// Update stats if necessary
	if ( this.fpsStats )  { this.fpsStats.update() ; }
	
	// Clear the screen
	this.renderer.clear() ;
	
	if ( this.skyEntity instanceof tdk.SkyEntity )
	{
		// Update the sky entity
		this.skyEntity.update() ;
		
		// Render the sky entity
		this.renderer.render( this.skyEntity.internalScene , this.skyEntity.internalCamera ) ;
		
		// Only clear the depth buffer
		this.renderer.clear( false , true , false ) ;
	}
	
	this.renderer.render( this.scene , this.camera ) ;
} ;



Engine.prototype.startAutoResize = function startAutoResize()
{
	var self = this ;
	
	window.addEventListener( 'resize' , function() {
		self.resizeToContainer.call( self ) ;
	} , false ) ;
	
	return this ;
} ;



Engine.prototype.stopAutoResize = function stopAutoResize()
{
	window.removeEventListener( 'resize' ) ;
	return this ;
} ;



Engine.prototype.resizeToContainer = function resizeToContainer()
{
	// notify the renderer of the size change
	this.width = window.innerWidth ;
	this.height = window.innerHeight ;
	
	/*
	this.width = this.container.innerWidth ;
	this.height = this.container.innerHeight ;
	console.log( this.container.width ) ;
	*/
	
	this.aspect = this.width / this.height ;
	this.renderer.setSize( this.width , this.height ) ;
	
	// update the camera 
	if ( this.camera )
	{
		this.camera.aspect = this.aspect ;
		this.camera.updateProjectionMatrix() ;
		
		// update the skybox camera 
		if ( this.skyEntity )  { this.skyEntity.setExternalCamera( this.camera ) ; }
	}
} ;


