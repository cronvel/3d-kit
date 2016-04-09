
## Generic

#### Axis

	X		constrain mouse operation to the X-axis
	Y		constrain mouse operation to the Y-axis
	Z		constrain mouse operation to the Z-axis
	Shift-X	constrain mouse operation to the Y-Z plane
	Shift-Y	constrain mouse operation to the X-Z plane
	Shift-Z	constrain mouse operation to the X-Y plane

#### View

*(on laptop, activate: “User preferences > Input > Emulate numpad”, to use the non keypad numbers)*

	5		switch perspective/orthographic
	1		front view
	Ctrl-1	back view
	3		right view
	Ctrl-3	left view
	7		top view
	Ctrl-7	bottom view
	9		switch view direction (e.g. top/bottom, right/left, front/back)
	0		switch from/to camera view



## “Default” view

	tab		switch from object-mode to edit-mode
	G		translate the selection
	R		rotate the selection
	S		scale the selection
	Z		turn on/off wireframe mode
	Shift-C	move the 3D cursor at origin
	Shift-Tab	turn on/off snapping to the grid

#### Menus

	Shift-S	snap menu



### Panels

	T		tool panel (left side)
	N		property panel (right side)



### Object mode

	Shift-D	duplicate object
	Ctrl-N	normal outside
	Ctrl-J	merge objects

#### Menus

	Ctrl-A	apply menu (apply scale, rotation, etc)
	Ctrl-T	track menu
	Shift-A	add menu (mesh, armature, camera, etc)
	Ctrl-P	“set parent to” menu, e.g. assign an object to a bone/armature



### Edit mode

	A		select all faces/edges/vertices
	E		extrude the selection
	Ctrl-N	normal outside
	Ctrl-T	convert to tris

#### Menus

	Ctrl-V	vertex menu
	Ctrl-E	edge menu
	Ctrl-F	face menu
	W		Special
	U		unwrap menu



## Howto

* Split edge/vertex normal: select sharp edges, then mark them as sharp: Ctrl-E > “mark as sharp”, then in the right panel,
  “modifier” tab, “add modifier” > “edge split”
* Add armature/bones: Object mode, Shift-A
* Assign an object to a bone/armature: Object mode, Ctrl-P
* Add a vertex at the center of a face: select it, E (extrude), S (scale), 0 (scale to 0 size), Ctrl-V > “remove double” (remove
  duplicated vertices)
* Bridge edge loop: select 2 loops, W > “Bridge edge loop”



### Bones

* Add a bone: Shift-A “add armature” > “single bone”
* Add a bone connected to the selected bone: E (extrusion)
* Make a bone to depend on another unconnected bone: select the child, select the parent, Ctrl-P > “Keep Offset”




