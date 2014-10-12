var gui = new dat.GUI();
	
Engine.Parameters = function() {
	// Display Parameters

	// Model
	this.modelVisible = false; 
	this.modelWire = false;
	this.modelSmooth = true;
	this.modelColor = "#ff8800";
	// Voxel
	this.voxelVisible = false;
	this.voxelWire = false;
	this.voxelColorNormal = true;
	this.voxelColor = "#88ff00";
	// Octree
	this.octreeVisible = true;
	this.octreeWire = true;
	this.octreeShowEmpty = false;
	this.octreeColor = "#0088ff";

	// Voxel parameters
	this.modelScale = 4;
	this.voxelAutoUpdate = false;
	this.voxelSliceHeight = 4;
	this.voxelSlicePosition = 0;

	// Controls
	this.modeFPS = false;

	// Level of details
	this.exploreMode = false;
	this.octreeLOD = 4;
	this.distanceFactor = 8.0;
	this.distanceOffset = 0.0;
	this.distanceMax = 8.0;
	this.distanceVortex = 0.01;
	//
	this.helperDistanceFromCenter = 10;

	// Buttons
	this.reparseVoxels = function() { reparseVoxels(); }
	// this.parseVoxels = function() { parseVoxels(); }
};

function initGUI()
{
	// Display
	var folderDisplay = gui.addFolder('Display Options');
	
	// Model Display
	var folderDisplayModel = folderDisplay.addFolder('Model');
	folderDisplayModel.add( parameters, 'modelVisible' ).name('Show').onChange(updateDisplay);
	folderDisplayModel.add( parameters, 'modelWire' ).name('Wireframe').onChange(updateDisplay);
	// folderDisplayModel.add( parameters, 'modelSmooth' ).name('Smooth Shading').onChange(updateDisplay);
	folderDisplayModel.addColor( parameters, 'modelColor' ).name('Color').onChange(updateDisplay);
	folderDisplayModel.open();

	// Voxel Display
	var folderDisplayVoxel = folderDisplay.addFolder('Voxel');
	folderDisplayVoxel.add( parameters, 'voxelVisible' ).name('Show').onChange(updateDisplay);
	folderDisplayVoxel.add( parameters, 'voxelWire' ).name('Wireframe').onChange(updateDisplay);
	folderDisplayVoxel.add( parameters, 'voxelColorNormal' ).name('Normal Color').onChange(updateDisplay);
	folderDisplayVoxel.addColor( parameters, 'voxelColor' ).name('Color').onChange(updateDisplay);
	folderDisplayVoxel.open();

	// Octree Display
	var folderDisplayOctree = folderDisplay.addFolder('Octree');
	folderDisplayOctree.add( parameters, 'octreeVisible' ).name('Show').onChange(updateDisplay);
	folderDisplayOctree.add( parameters, 'octreeWire' ).name('Wireframe').onChange(updateDisplay);
	folderDisplayOctree.add( parameters, 'octreeShowEmpty' ).name('Show Empty').onChange(updateDisplay);
	folderDisplayOctree.addColor( parameters, 'octreeColor' ).name('Color').onChange(updateDisplay);
	folderDisplayOctree.open();
	
	// Voxel Options
	var folderVoxel = gui.addFolder('Voxel Options');
	folderVoxel.add( parameters, 'modelScale').min(1).max(32).step(1).name('Model Scale').onChange(updateScale);
	folderVoxel.add( parameters, 'voxelAutoUpdate' ).name('Auto Update');
	folderVoxel.add( parameters, 'reparseVoxels' ).name('Generate Voxels');
	folderVoxel.add( parameters, 'voxelSlicePosition').min(0).max(128).step(1).name('Voxel Slice Position');
	folderVoxel.add( parameters, 'voxelSliceHeight').min(1).max(128).step(1).name('Voxel Slice Height');
	// folderVoxel.open();

	// Level of Details
	var folderLOD = gui.addFolder('Octree Options');
	folderLOD.add( parameters, 'octreeLOD').min(0).max(6).step(1).name('Level of Details').onChange(onChangeOptionOctree);
	folderLOD.add( parameters, 'exploreMode' ).name('exploreMode').onChange(onChangeOptionOctree);
	folderLOD.add( parameters, 'distanceFactor' ).min(1).max(20).step(1).name('Scope Distance').onChange(onChangeOptionOctree);
	// folderLOD.add( parameters, '' )
	folderLOD.add( parameters, 'helperDistanceFromCenter').min(0).max(20).name('Helder Distance').onChange(onChangeOptionOctree);
	// folderLOD.add( parameters, 'distanceOffset' ).min(0).max(100).step(1).name('Offset Distance').onChange(onChangeOptionOctree);
	// folderLOD.add( parameters, 'distanceMax' ).min(1).max(20).step(1).name('Min Distance').onChange(onChangeOptionOctree);
	// folderLOD.add( parameters, 'distanceVortex' ).min(0.01).max(2.0).step(0.1).name('Vortex Radius').onChange(onChangeOptionOctree);
	// folderLOD.open();
	//

	gui.add( parameters, 'modeFPS' ).name('Mode FPS').onChange(updateControls);
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

function onChangeOptionOctree(value)
{

}