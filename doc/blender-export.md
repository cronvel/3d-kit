
*Tested with Blender v2.81a, Babylon exporter plugin v6.2.4 and Babylon.js v4.0.3.*



## Preliminaries: install the Three.js exporter add-on

* Get the Babylon.js exporter for blender, located in the repository at: https://github.com/BabylonJS/BlenderExporter
* Open Blender, go to File > User Preferences, click the Add-ons tab, then "install from file", browse and select the zip



## Blender part

* Create a basic mesh, select all faces
* Go to the texture panel (right panel), click the texture for material, choose the "image or movie" type, open your texture
* The object must have all transformations applied (or the model will load with already defined translation/rotation/scale
  but we want to export using world coordinate), to apply: in 3D view, select the object Ctrl-A > “All transforms”
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
* In the “world” tab, check that decimal precision is enough
* Export the file: File > Export > Babylon.js



## Babylon.js part

Your materials and textures would be lost, but your texture UV-mapping is OK.

```
var imported = await Babylon.SceneLoader.ImportMeshAsync( "objectID" , "path/to/model.babylon" , null , scene ) ;
model = imported.meshes[ 0 ] ;
```

