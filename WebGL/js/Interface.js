
// DISPLAY
function onChangeModelDisplay(value) { Engine.modelManager.UpdateDisplay(); }
function onChangeVoxelDisplay(value) { Engine.voxelManager.UpdateDisplay(); }
function onChangeOctreeDisplay(value) { Engine.octreeManager.UpdateDisplay(); }

// SCALE
function onChangeModelScale(value)
{
    // Model
    Engine.modelManager.UpdateScale(value);
    if (Engine.Parameters.autoUpdate) {
        Engine.voxelManager.UpdateWithModel(Engine.modelManager.GetModel());
    }
}

// OCTREE
function onChangeOptionOctree(value)
{
    Engine.octreeManager.UpdateLevelOfDetails();
}

// SELECT MODEL
function onChangeModel(value)
{
    // Model
    Engine.modelManager.UpdateModel(value);
    // Voxel
    Engine.voxelManager.Update();
}

// SELECT CONTROL
function onChangeControlsMode(value)
{
    
}

var buttons = {
    updateVoxels: function() { Engine.voxelManager.Update(); }
};

Engine.Interface = function()
{
    //
    var gui = new dat.GUI();
    
    //
    var parameters = Engine.Parameters;
    
	// Display
	var folderDisplay = gui.addFolder('Display Options');
	
	// Model Display
	var folderDisplayModel = folderDisplay.addFolder('Model');
	folderDisplayModel.add( parameters, 'modelVisible' ).name('Show').onChange(onChangeModelDisplay);
	folderDisplayModel.add( parameters, 'modelWire' ).name('Wireframe').onChange(onChangeModelDisplay);
	// folderDisplayModel.add( parameters, 'modelSmooth' ).name('Smooth Shading').onChange(onChangeModelDisplay);
	folderDisplayModel.addColor( parameters, 'modelColor' ).name('Color').onChange(onChangeModelDisplay);
	folderDisplayModel.open();

	// Voxel Display
	var folderDisplayVoxel = folderDisplay.addFolder('Voxel');
	folderDisplayVoxel.add( parameters, 'voxelVisible' ).name('Show').onChange(onChangeVoxelDisplay);
	folderDisplayVoxel.add( parameters, 'voxelWire' ).name('Wireframe').onChange(onChangeVoxelDisplay);
	folderDisplayVoxel.add( parameters, 'voxelColorNormal' ).name('Normal Color').onChange(onChangeVoxelDisplay);
	folderDisplayVoxel.addColor( parameters, 'voxelColor' ).name('Color').onChange(onChangeVoxelDisplay);
	folderDisplayVoxel.open();

	// Octree Display
	var folderDisplayOctree = folderDisplay.addFolder('Octree');
	folderDisplayOctree.add( parameters, 'octreeVisible' ).name('Show').onChange(onChangeOctreeDisplay);
	folderDisplayOctree.add( parameters, 'octreeWire' ).name('Wireframe').onChange(onChangeOctreeDisplay);
	folderDisplayOctree.add( parameters, 'octreeShowEmpty' ).name('Show Empty').onChange(onChangeOctreeDisplay);
	folderDisplayOctree.addColor( parameters, 'octreeColor' ).name('Color').onChange(onChangeOctreeDisplay);
	folderDisplayOctree.open();
	
	// Voxel Options
	var folderVoxel = gui.addFolder('Voxel Options');
	folderVoxel.add( parameters, 'modelScale').min(1).max(32).step(1).name('Model Scale').onChange(onChangeModelScale);
	folderVoxel.add( parameters, 'autoUpdate' ).name('Auto Update');
	folderVoxel.add( buttons, 'updateVoxels' ).name('Update Voxels');
//	folderVoxel.add( parameters, 'voxelSlicePosition').min(0).max(128).step(1).name('Voxel Slice Position');
//	folderVoxel.add( parameters, 'voxelSliceHeight').min(1).max(128).step(1).name('Voxel Slice Height');
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

    gui.add( parameters, 'txt', Engine.modelManager.modelsNames ).name('Model').onChange(onChangeModel);
    
	gui.add( parameters, 'modeFPS' ).name('Mode FPS').onChange(onChangeControlsMode);
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