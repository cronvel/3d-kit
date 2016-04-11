
# Keys

## 3D View

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
	
	X		constrain mouse operation to the X-axis
	Y		constrain mouse operation to the Y-axis
	Z		constrain mouse operation to the Z-axis
	Shift-X	constrain mouse operation to the Y-Z plane
	Shift-Y	constrain mouse operation to the X-Z plane
	Shift-Z	constrain mouse operation to the X-Y plane
	
	tab		switch from object-mode to edit-mode
	G		translate the selection
	R		rotate the selection
	S		scale the selection
	Z		turn on/off wireframe mode
	Shift-C	move the 3D cursor at origin
	Shift-Tab	turn on/off snapping to the grid
	
	

### Menus

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



### Pose mode

	Shift-Ctrl-C	Set a bone as a constraint of another
	Ctrl-A		Apply menu (apply the “rest pose”)



## Dope sheet view

	LMB		move keys in the timeline
	RMB		change active frame in the timeline
	I		IN THE 3D VIEW when the “dope sheet” view is open; insert keyframe (after selecting all bones)
	Ctrl-C	IN THE 3D VIEW copy the bone position
	Shift-Ctrl-V	IN THE 3D VIEW paste the bone position




# Howto

* Split edge/vertex normal: select sharp edges, then mark them as sharp: Ctrl-E > “mark as sharp”, then in the right panel,
  “modifier” tab, “add modifier” > “edge split”
* Add armature/bones: Object mode, Shift-A
* Assign an object to a bone/armature: Object mode, Ctrl-P
* Add a vertex at the center of a face: select it, E (extrude), S (scale), 0 (scale to 0 size), Ctrl-V > “remove double” (remove
  duplicated vertices)
* Bridge edge loop: select 2 loops, W > “Bridge edge loop”



## Bones, skinning

* Add a bone: Shift-A “add armature” > “single bone”
* Add a bone connected to the selected bone: E (extrusion)
* Make a bone to depend on another unconnected bone: select the child, select the parent, Ctrl-P > “Keep Offset”
* Controler (IK) bone using inverse kinematic: create an IK bone in a new armature, switch to “pose mode”,
  select the bone that will be under inverse kinematic influence, go to the “bone constraints” tab (right panel),
  click “add bone constraints” > “inverse kinematic”, then choose the new armature as “target”, and choose the IK bone
  as “bone”. The “chain length” value is the number of bones affected by the controler bone, and “0” means “all bones”.
  Alternatively, select the IK bone, then the controled bone and hit Shift-Ctrl-C
* Make a bone controle rotation: same than previous but use “pole target” instead of target
* Assign object and vertices to armature: select object, select armature, Ctrl-P (“set parent”) > “with automatic weight”



## Animation

Split the window and choose “dope sheet” instead of “3D view” (bottom left).
Switch mode of the dope sheet window to “action editor”.
Add a new action and name it.
At the bottom-right of the screen, in the timeline view, set “active keying set” to “LocRot”

Select all bones in the 3D view and hit “I” in the 3D view: it will add all bones to the current key frame.

LMB move the keys, RMB change the active frame in the timeline.


