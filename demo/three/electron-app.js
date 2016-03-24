


// Ensure we are running 'electron' instead of 'node'
var versions = process.versions ;
//console.log( versions ) ;

if ( ! versions.electron )
{
	console.log( "This program should be loaded by 'electron' instead of 'node'" ) ;
	process.exit() ;
}



// Load modules

// Module to control application life.
var app = require( 'app' ) ;

// Module to create native browser window.
var BrowserWindow = require( 'browser-window' ) ;

// Get the crash reporter
var crashReporter = require( 'crash-reporter' ) ;

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
if ( ( argPos = args.indexOf( '--dev' ) ) !== -1 )
{
	args.splice( argPos , 1 ) ;
	devTools = true ;
}


// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on( 'ready' , function() {
	
	// Create the browser window.
	mainWindow = new BrowserWindow( {
		width: 800 ,
		height: 480
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


