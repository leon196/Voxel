var gui = new dat.GUI();
	
Parameters = function() {
	// Display Parameters

	// Model
	this.modelVisible = true; 
	this.modelWire = false;
	this.modelSmooth = true;
	this.modelColor = "#ff8800";
	// Voxel
	this.voxelVisible = true;
	this.voxelWire = true;
	this.voxelColorNormal = true;
	this.voxelColor = "#88ff00";
	// Octree
	this.octreeVisible = true;
	this.octreeWire = true;
	this.octreeShowEmpty = false;
	this.octreeColor = "#0088ff";

	// Global parameters
	this.modelScale = 16;
	this.octreeLOD = 4;
	this.voxelAutoUpdate = false;

	// Buttons
	this.reparseVoxels = function() { reparseVoxels(); }
	// this.parseVoxels = function() { parseVoxels(); }
};

function initGUI()
{
	// Display
	var folderDisplay = gui.addFolder('Display Options');
	// Model
	var folderDisplayModel = folderDisplay.addFolder('Model');
	folderDisplayModel.add( parameters, 'modelVisible' ).name('Show').onChange(updateDisplay);
	folderDisplayModel.add( parameters, 'modelWire' ).name('Wireframe').onChange(updateDisplay);
	// folderDisplayModel.add( parameters, 'modelSmooth' ).name('Smooth Shading').onChange(updateDisplay);
	folderDisplayModel.addColor( parameters, 'modelColor' ).name('Color').onChange(updateDisplay);
	folderDisplayModel.open();
	// Voxel
	var folderDisplayVoxel = folderDisplay.addFolder('Voxel');
	folderDisplayVoxel.add( parameters, 'voxelVisible' ).name('Show').onChange(updateDisplay);
	folderDisplayVoxel.add( parameters, 'voxelWire' ).name('Wireframe').onChange(updateDisplay);
	folderDisplayVoxel.add( parameters, 'voxelColorNormal' ).name('Normal Color').onChange(updateDisplay);
	folderDisplayVoxel.addColor( parameters, 'voxelColor' ).name('Color').onChange(updateDisplay);
	folderDisplayVoxel.open();
	// Octree
	var folderDisplayOctree = folderDisplay.addFolder('Octree');
	folderDisplayOctree.add( parameters, 'octreeVisible' ).name('Show').onChange(updateDisplay);
	folderDisplayOctree.add( parameters, 'octreeWire' ).name('Wireframe').onChange(updateDisplay);
	folderDisplayOctree.add( parameters, 'octreeShowEmpty' ).name('Show Empty').onChange(updateDisplay);
	folderDisplayOctree.addColor( parameters, 'octreeColor' ).name('Color').onChange(updateDisplay);
	folderDisplayOctree.open();

	gui.add( parameters, 'modelScale').min(1).max(32).step(1).name('Model Scale').onChange(updateScale);
	gui.add( parameters, 'octreeLOD').min(0).max(8).step(1).name('Level of Details').onChange(updateLOD);
	gui.add( parameters, 'voxelAutoUpdate' ).name('Auto Update');
	gui.add( parameters, 'reparseVoxels' ).name('Generate Voxels');
	gui.open();
	// folderDisplay.open();

	// controller.onChange(function(value) {
	//   // Fires on every change, drag, keypress, etc.
	// });

	// controller.onFinishChange(function(value) {
	//   // Fires when a controller loses focus.
	//   alert("The new value is " + value);
	// });

	// var folderVoxel = gui.addFolder('Voxel Options');
	// folderVoxel.open();
}
/*
var folder1 = gui.addFolder('Coordinates');
folder1.add( parameters, 'x' );
folder1.add( parameters, 'y' );
folder1.close();
*/
/*
var parameters = 
{
	a: 200, // numeric
	b: 200, // numeric slider
	c: "Hello, GUI!", // string
	d: false, // boolean (checkbox)
	e: "#ff8800", // color (hex)
	f: function() { alert("Hello!") },
	g: function() { alert( parameters.c ) },
	v : 0,    // dummy value, only type is important
	w: "...", // dummy value, only type is important
	x: 0, y: 0, z: 0
};
// gui.add( parameters )
gui.add( parameters, 'a' ).name('Number');
gui.add( parameters, 'b' ).min(128).max(256).step(16).name('Slider');
gui.add( parameters, 'c' ).name('String');
gui.add( parameters, 'd' ).name('Boolean');

gui.addColor( parameters, 'e' ).name('Color');

var numberList = [1, 2, 3];
gui.add( parameters, 'v', numberList ).name('List');

var stringList = ["One", "Two", "Three"];
gui.add( parameters, 'w', stringList ).name('List');
*/