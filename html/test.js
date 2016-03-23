
var three = require( 'three' ) ;

var scene, camera, renderer;
var geometry, material, mesh;


init();
animate();

function init() {

	scene = new three.Scene();

	camera = new three.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;

	geometry = new three.BoxGeometry( 200, 200, 200 );
	material = new three.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

	mesh = new three.Mesh( geometry, material );
	scene.add( mesh );

	renderer = new three.WebGLRenderer();
	renderer.setSize( window.innerWidth * 0.97 , window.innerHeight * 0.95 );

	document.body.appendChild( renderer.domElement );
}

function animate() {

	requestAnimationFrame( animate );

	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;

	renderer.render( scene, camera );

}
