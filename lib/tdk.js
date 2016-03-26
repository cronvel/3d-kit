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



var tdk = {} ;
module.exports = tdk ;



// Needed to load THREE.js stuff without patching them beforehand
global.THREE = require( 'three' ) ;



tdk.DEGREE_0 = 0 ;
tdk.DEGREE_360 = Math.PI * 2 ;
tdk.DEGREE_180 = Math.PI ;
tdk.DEGREE_120 = Math.PI / 1.5 ;
tdk.DEGREE_90 = Math.PI / 2 ;
tdk.DEGREE_60 = Math.PI / 3 ;
tdk.DEGREE_45 = Math.PI / 4 ;
tdk.DEGREE_30 = Math.PI / 6 ;
tdk.DEGREE_135 = tdk.DEGREE_90 + tdk.DEGREE_45 ;
tdk.DEGREE_150 = tdk.DEGREE_120 + tdk.DEGREE_30 ;



// /!\ Tmp...
tdk.config = {
	anisotropy: 4
} ;



tdk.Engine = require( './Engine.js' ) ;
tdk.Keyboard = require( './Keyboard.js' ) ;
tdk.Orientation = require( './Orientation.js' ) ;
tdk.SkyEntity = require( './SkyEntity.js' ) ;
tdk.CubeGeometry = require( './CubeGeometry.js' ) ;
tdk.Material = require( './Material.js' ) ;



// Load three.js extensions
require( './ext/TrackballControls.js' ) ;


