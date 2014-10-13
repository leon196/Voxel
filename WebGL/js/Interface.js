
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
        Engine.voxelManager.UpdateModel();
        Engine.octreeManager.UpdatePoints();
        Engine.octreeManager.Update();
    }
}

// OCTREE
function onChangeOptionOctree(value)
{
    Engine.octreeManager.Update();
}

// SELECT MODEL
function onChangeModel(value)
{
    Engine.modelManager.UpdateModel(value);
    Engine.voxelManager.Update();
    Engine.octreeManager.UpdatePoints();
    Engine.octreeManager.Update();
}

// SELECT CONTROL
function onChangeControlsMode(value)
{
    
}

var buttons =
{    
    updateVoxels: function() { Engine.Update(); },
    clearVoxels: function() { Engine.Clear(); }
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
    folderDisplayOctree.add( parameters, 'octreeColorNormal' ).name('Normal Color').onChange(onChangeOctreeDisplay);
	folderDisplayOctree.addColor( parameters, 'octreeColor' ).name('Color').onChange(onChangeOctreeDisplay);
	folderDisplayOctree.open();
    
	// Model Options
	var folderModel = gui.addFolder('Model Options');
    folderModel.add( parameters, 'txt', Engine.modelManager.modelsNames ).name('Mesh').onChange(onChangeModel);
	folderModel.add( parameters, 'modelScale').min(1).max(20).step(1).name('Model Scale').onChange(onChangeModelScale);
    folderModel.open();
	
	// Voxel Options
	var folderVoxel = gui.addFolder('Voxel Options');
	folderVoxel.add( parameters, 'autoUpdate' ).name('Auto Update');
	folderVoxel.add( buttons, 'updateVoxels' ).name('Update');
	folderVoxel.add( buttons, 'clearVoxels' ).name('Clear');
//	folderVoxel.add( parameters, 'voxelSlicePosition').min(0).max(128).step(1).name('Voxel Slice Position');
//	folderVoxel.add( parameters, 'voxelSliceHeight').min(1).max(128).step(1).name('Voxel Slice Height');
    folderVoxel.add( parameters, 'voxelCount' ).name('Voxels :').listen();
	 folderVoxel.open();

	// Level of Details
	var folderOctree = gui.addFolder('Octree Options');
	folderOctree.add( parameters, 'octreeLOD').min(0).max(6).step(1).name('Level of Details').onChange(onChangeOptionOctree);
    folderOctree.open();
    
	var folderLOD = folderOctree.addFolder('Local Level of Details');
	folderLOD.add( parameters, 'exploreMode' ).name('Enabled').onChange(onChangeOptionOctree);
	folderLOD.add( parameters, 'txt', Engine.lodManager.modes ).name('Mode').onChange(onChangeOptionOctree);
	folderLOD.add( parameters, 'showHelper' ).name('Show Helper').onChange(onChangeOptionOctree);
	folderLOD.add( parameters, 'distanceFactor' ).min(1).max(20).step(1).name('Scope Distance').onChange(onChangeOptionOctree);
	// folderLOD.add( parameters, '' )
	// folderLOD.add( parameters, 'distanceOffset' ).min(0).max(100).step(1).name('Offset Distance').onChange(onChangeOptionOctree);
	 folderLOD.add( parameters, 'distanceMax' ).min(1).max(20).step(1).name('Max Distance').onChange(onChangeOptionOctree);
	 folderLOD.add( parameters, 'distanceVortex' ).min(0.01).max(2.0).step(0.1).name('Vortex Radius').onChange(onChangeOptionOctree);
	 folderLOD.open();
	//

	var folderControlsOption = gui.addFolder('Controls Options');
    folderControlsOption.add( parameters, 'modeFPS' ).name('Mode FPS').onChange(onChangeControlsMode);
    folderControlsOption.open();
    
    
	gui.open();
}