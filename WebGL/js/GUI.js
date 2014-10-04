var gui = new dat.GUI();
	
Parameters = function() {
	// Display Parameters
	this.modelVisible = true; 
	this.modelWire = true;
	this.modelColor = "#ff8800";
	this.voxelVisible = true;
	this.voxelWire = true;
	this.voxelColorNormal = true;
	this.voxelColor = "#88ff00";

	// Global parameters
	this.modelScale = 8;

	// Buttons
	// this.cleanVoxels = function() { cleanVoxels(); }
	// this.parseVoxels = function() { parseVoxels(); }
};

function initGUI()
{
	var folderDisplay = gui.addFolder('Display Options');
	folderDisplay.add( parameters, 'modelVisible' ).name('Show Model').onChange(updateDisplay);
	folderDisplay.add( parameters, 'modelWire' ).name('Model Wireframe').onChange(updateDisplay);
	folderDisplay.addColor( parameters, 'modelColor' ).name('Model Color').onChange(updateDisplay);
	folderDisplay.add( parameters, 'voxelVisible' ).name('Show Voxel').onChange(updateDisplay);
	folderDisplay.add( parameters, 'voxelWire' ).name('Voxel Wireframe').onChange(updateDisplay);
	folderDisplay.add( parameters, 'voxelColorNormal' ).name('Voxel Normal Color').onChange(updateDisplay);
	folderDisplay.addColor( parameters, 'voxelColor' ).name('Voxel Color').onChange(updateDisplay);
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
	gui.add( parameters, 'modelScale').min(1).max(128).step(1).name('Model Scale').onChange(updateDisplay);
	// gui.add( parameters, 'parseVoxel' ).name('Generate Voxel');
	gui.open();
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