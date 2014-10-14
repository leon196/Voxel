
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

// SOLIDIFY
function onChangeSolidify(value)
{

}

// CHANGE MODE
function onChangeMode(value)
{
    Engine.lodManager.ChangeMode(value);
}
function onChangeGenerationMode(value)
{
    Engine.lodManager.ChangeGenerationMode(value);
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
    if (Engine.Parameters.autoClearOnChangeModel) {
        Engine.Clear();
    }
    Engine.voxelManager.UpdateModel();
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
    folderModel.add( parameters, 'autoClearOnChangeModel' ).name('Clear Auto');
    folderModel.add( parameters, 'txt', Engine.modelManager.modelsNames ).name('Mesh').onChange(onChangeModel);
	folderModel.add( parameters, 'modelScale').min(1).max(20).step(1).name('Model Scale').onChange(onChangeModelScale);
	folderModel.add( parameters, 'solidify').name('Solidify').onChange(onChangeSolidify);
    folderModel.open();
	
	// Voxel Options
	var folderVoxel = gui.addFolder('Voxel Options');
	folderVoxel.add( parameters, 'paintMode' ).name('Paint Mode');
//	folderVoxel.add( parameters, 'voxelSlicePosition').min(0).max(128).step(1).name('Voxel Slice Position');
//	folderVoxel.add( parameters, 'voxelSliceHeight').min(1).max(128).step(1).name('Voxel Slice Height');
//    folderVoxel.add( parameters, 'minVoxelScale' ).min(0.125).max(8).step(0.1).name('Scale Minimum');
    folderVoxel.add( parameters, 'voxelCount' ).name('Voxels :').listen();
	 folderVoxel.open();

	// Level of Details
	var folderOctree = gui.addFolder('Octree Options');
	folderOctree.add( parameters, 'octreeLOD').min(0).max(12).step(1).name('Level of Details').onChange(onChangeOptionOctree);
    folderOctree.add( parameters, 'minOctreeDimension' ).min(0.125).max(0.5).step(0.1).name('Scale Minimum');
    folderOctree.add( parameters, 'generateMode' ).name('Generate Depth');
    folderOctree.add( parameters, 'txt', Engine.lodManager.generationModes ).name('Generation').onChange(onChangeGenerationMode);
    folderOctree.open();
    
	var folderLOD = folderOctree.addFolder('Local Level of Details');
	folderLOD.add( parameters, 'exploreMode' ).name('Enabled').onChange(onChangeOptionOctree);
	folderLOD.add( parameters, 'exploreModeAutoUpdate' ).name('Auto Update');
	folderLOD.add( parameters, 'txt', Engine.lodManager.modes ).name('Mode').onChange(onChangeMode);
//	folderLOD.add( parameters, 'showHelper' ).name('Show Helper').onChange(onChangeOptionOctree);
	folderLOD.add( parameters, 'distanceFactor' ).min(1).max(50).step(1).name('Distance').onChange(onChangeOptionOctree);
    folderLOD.add( parameters, 'vortexMode' ).name('Vortex').onChange(onChangeOptionOctree);
    
    var foldeLODAdvanced = folderLOD.addFolder('Distance Options');
    foldeLODAdvanced.add( parameters, 'distancePower' ).min(1).max(4).step(1).name('Exponent').onChange(onChangeOptionOctree);
	// folderLOD.add( parameters, '' )
	 foldeLODAdvanced.add( parameters, 'distanceOffset' ).min(0).max(100).step(1).name('Offset').onChange(onChangeOptionOctree);
	 foldeLODAdvanced.add( parameters, 'distanceMax' ).min(1).max(100).step(1).name('Max').onChange(onChangeOptionOctree);
//	 folderLOD.add( parameters, 'distanceVortex' ).min(0.0).max(100.0).step(1.0).name('Vortex Radius').onChange(onChangeOptionOctree);
	 folderLOD.open();
	//

	var folderControlsOption = gui.addFolder('Controls Options');
    folderControlsOption.add( parameters, 'modeFPS' ).name('Mode FPS').onChange(onChangeControlsMode);
//    folderControlsOption.open();
    
	gui.add( parameters, 'autoUpdate' ).name('Auto Update');
	gui.add( buttons, 'updateVoxels' ).name('Update');
	gui.add( buttons, 'clearVoxels' ).name('Clear');
    
    
	gui.open();
}