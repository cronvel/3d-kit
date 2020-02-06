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

const electron = require( 'electron' ) ;
const app = electron.app ;
const BrowserWindow = electron.BrowserWindow ;
const crashReporter = electron.crashReporter ;



// Ensure we are running 'electron' instead of 'node'
var versions = process.versions ;
//console.log( versions ) ;

if ( ! versions.electron ) {
	console.log( "This program should be loaded by 'electron' instead of 'node'" ) ;
	process.exit() ;
}

// Safely set the process' title from the package name
process.title = require( './package.json' ).name ;

// Start the crash reporter
//crashReporter.start() ;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null ;



// Quit when all windows are closed.
app.on( 'window-all-closed' , function() {
	if ( process.platform !== 'darwin' )
	{
		app.quit() ;
	}
} ) ;



var argPos , devTools = false , args = process.argv.slice() ;

// Open dev tools?
if ( ( argPos = args.indexOf( '--dev' ) ) !== -1 ) {
	args.splice( argPos , 1 ) ;
	devTools = true ;
}


// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on( 'ready' , function() {
	// Create the browser window.
	mainWindow = new BrowserWindow( {
		width: 800 ,
		height: 600 ,
		webPreferences: {
			nodeIntegration: true
		}
	} ) ;
	
	// Open dev tools?
	if ( devTools ) { mainWindow.openDevTools() ; }
	
	// and load the index.html of the app.
	mainWindow.loadURL( 'file://' + __dirname + '/demo.html' ) ;
	
	// Emitted when the window is closed.
	mainWindow.on( 'closed' , function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null ;
	} ) ;
	
} ) ;

