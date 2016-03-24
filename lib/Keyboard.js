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



// Based on THREEx.KeyboardState.js

function Keyboard()
{
	var self = this ;
	
	if ( ! ( self instanceof Keyboard ) ) { self = Object.create( Keyboard.prototype ) ; }
	
	// to store the current state
	self.keyCodes = {} ;
	self.modifiers = {} ;
	
	// create callback to bind/unbind keyboard events
	self.onKeyDown = function( event ) { self.onKeyChange( event , true ) ; } ;
	self.onKeyUp = function( event ) { self.onKeyChange( event , false ) ; } ;
	
	// bind keyEvents
	document.addEventListener( 'keydown' , self.onKeyDown , false ) ;
	document.addEventListener( 'keyup' , self.onKeyUp , false ) ;
	
	return self ;
}

module.exports = Keyboard ;



// to stop listening of the keyboard events
Keyboard.prototype.destroy = function()
{
	// unbind keyEvents
	document.removeEventListener( 'keydown' , this.onKeyDown , false ) ;
	document.removeEventListener( 'keyup' , this.onKeyUp , false ) ;
} ;



// to process the keyboard dom event
Keyboard.prototype.onKeyChange = function onKeyChange( event , pressed )
{
	// log to debug
	//console.log( "onKeyChange", event, pressed, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)
	
	// update this.keyCodes
	var code = event.keyCode ;
	this.keyCodes[ code ] = pressed ;
	
	// update this.modifiers
	this.modifiers.shift = event.shiftKey ;
	this.modifiers.ctrl = event.ctrlKey ;
	this.modifiers.alt = event.altKey ;
	this.modifiers.meta = event.metaKey ;
} ;



// Return true if the key combo is pressed, false otherwise.
// The keyCombo is an array of keys
Keyboard.prototype.pressed = function pressed( keyCombo , all )
{
	var i , key , pressed , length ;
	
	if ( ! ( keyCombo instanceof Array ) ) { keyCombo = [ keyCombo ] ; }
	all = ( all === undefined || all ) ? true : false ;
	
	length = keyCombo.length ;
	
	//if ( ( ++ cc % 50 ) === 0 )  console.log( this.keyCodes ) ;
	
	for ( i = 0 ; i < length ; i ++ )
	{
		key = keyCombo[ i ] ;
		
		if ( Keyboard.MODIFIERS.indexOf( key ) !== -1 )
		{
			pressed	= this.modifiers[ key ] ;
		}
		else if( Object.keys( Keyboard.ALIAS ).indexOf( key ) !== -1 )
		{
			pressed	= this.keyCodes[ Keyboard.ALIAS[ key ] ] ;
		}
		else
		{
			pressed	= this.keyCodes[ key.toUpperCase().charCodeAt(0) ] ;
		}
		
		if ( all ) { if ( ! pressed ) { return false ; } }
		else { if ( pressed ) { return true ; } }
	}
	
	return all ;
} ;



Keyboard.MODIFIERS = [ 'shift' , 'ctrl' , 'alt' , 'meta' ] ;



Keyboard.ALIAS = {
	
	'left'		: 37,
	'up'		: 38,
	'right'		: 39,
	'down'		: 40,
	
	'space'		: 32,
	'backspace'	: 8,
	'tab'		: 9,
	'return'	: 13,
	
	'pageup'	: 33,
	'pagedown'	: 34,
	'end'		: 35,
	'home'		: 36,
	'insert'	: 45,
	'delete'	: 46,
	
	'escape'	: 27,
	'qconsole'	: 176,	// ², the quake console key
	'pause'		: 19,
	
	'KP0'		: 96,
	'KP1'		: 97,
	'KP2'		: 98,
	'KP3'		: 99,
	'KP4'		: 100,
	'KP5'		: 101,
	'KP6'		: 102,
	'KP7'		: 103,
	'KP8'		: 104,
	'KP9'		: 105,
	
	'KP/'		: 111,
	'KP*'		: 106,
	'KP-'		: 109,
	'KP+'		: 107,
	'enter'		: 13,	// = Return :/
	'KP.'		: 110,
	
	'F1'		: 112,
	'F2'		: 113,
	'F3'		: 114,
	'F4'		: 115,
	'F5'		: 116,
	'F6'		: 117,
	'F7'		: 118,
	'F8'		: 119,
	'F9'		: 120,
	'F10'		: 121,
	'F11'		: 122,
	'F12'		: 123,
	
	'capslock'	: 20,
	'numlock'	: 144
} ;

