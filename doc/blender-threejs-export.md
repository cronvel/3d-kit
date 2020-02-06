
*For Three.js r75, tested with Blender 2.75*



## Preliminaries: install the Three.js exporter add-on

* Get the Three.js exporter for blender, located in the repository at: utils/exporters/blender/addons/io_three
* Zip the whole directory: zip -r io_three.zip io_three
* Open Blender, go to File > User Preferences, click the Add-ons tab, then "install from file", browse and select the io_three.zip



## Blender part

* Create a basic mesh, select all faces
* Go to the texture panel (right panel), click the texture for material, choose the "image or movie" type, open your texture
* The model must have UV-mapping, if it doesn't, then:
	* Below, set the coordinates' type to UV, flat projection
	* In the top panel, choose the "UV editing" view
	* At the bottom of the left part, choose the appropriate texture image
	* All faces should be selected (Edit mode), move the cursor in the right part of the view and press the 'U' key to open the UV menu
	* Choose "Unwrap" in the menu
	* If you get the "Non-Uniform Scaling during UV unwrap" warning, you need to apply the scale:
		* Switch to Object mode
		* Press Ctrl-A to open the "apply" menu, and choose "scale"
		* Retry the "Unwrap" operation
	* Now the UV coordinates should be OK
	* Return back to the main "Default" view (top panel)
* If you have trouble with normals, i.e. smooth edge where sharp one are expected, that's because faces are sharing the same
  vertices normals, to fix it:
	* in the left panel open the "modifier" tab
	* click "add modifier" and choose "edge split"
	* adjust the angle
	* apply it: now your vertices normals should be OK
* Export the file: File > Export > Three.js (.json)



## Three.js part

Your materials and textures would be lost, but your texture UV-mapping is OK.

```
// Load the Geometry
var loader = new THREE.JSONLoader() ;
var parsed = loader.parse( require( 'path/to/blender/model.json' ) ) ;
var modelGeometry = parsed.geometry ;

// Manually load your texture
var modelTexture = new THREE.TextureLoader().load( 'path/to/my/texture.jpg' ) ;

// Really important: by default the texture is set to THREE.ClampToEdgeWrapping, which fucked up your UV-mapping
modelTexture.wrapS = THREE.RepeatWrapping ;
modelTexture.wrapT = THREE.RepeatWrapping ;

var modelMaterial = new THREE.MeshLambertMaterial( { map: modelTexture } ) ;

var model = new THREE.Mesh( modelGeometry , modelMaterial ) ;

scene.add( model ) ;
```



To debug normals:

```
var edges = new THREE.VertexNormalsHelper( model, 2, 0x00ff00, 1 ) ;
scene.add( edges ) ;
```



## Export material (without texture)

If you want to export more than just raw geometries, but raw material (without texture):

* In blender: export the file: File > Export > Three.js (.json), do not forget to check the option “face materials”
* The Three.js source code becomes:

```
var loader = new THREE.JSONLoader() ;
var parsed = loader.parse( require( 'path/to/blender/model.json' ) ) ;
var model = new THREE.Mesh( parsed.geometry , new THREE.MeshFaceMaterial( parsed.materials ) ) ;
scene.add( model ) ;
```

Notice the `new THREE.MeshFaceMaterial`.



## Export animation

* When exporting in Blender, check “bones”, “skinning”, “skeletal animation”: “pose”, “embed animation”.

* Load the skinned mesh:

```
// Load the Geometry
var loader = new THREE.JSONLoader() ;
var parsed = loader.parse( require( 'path/to/blender/model.json' ) ) ;
var modelGeometry = parsed.geometry ;

// Enable skinning for each material, not sure why this does not work out of the box...
parsed.materials.forEach( mat => mat.skinning = true ) ;

// Use SkinnedMesh() instead of Mesh
var model = new THREE.SkinnedMesh( parsed.geometry , new THREE.MeshFaceMaterial( parsed.materials ) ) ;

// Create the animation mixer
var animationMixer = new THREE.AnimationMixer( model ) ;

// Get the first animation
var action = animationMixer.clipAction( parsed.geometry.animations[ 0 ] ) ;

action.setEffectiveWeight( 1 ) ;
action.play() ;

scene.add( model ) ;
```

* In your update function, do not forget to call `animationMixer.update()`:

```
function update()
{
	// ...
	
	var delta = clock.getDelta() ;
	if ( animationMixer ) { animationMixer.update( delta ); }
	
	// ...
}
```


