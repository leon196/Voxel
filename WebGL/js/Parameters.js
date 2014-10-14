Engine.Parameters =
{
    globalColorAmbient: "#030303",
    globalColorSpecular: "#660066",
    globalShininess: 10,
    
	// Model Display
	modelVisible: true, 
	modelWire: false,
	modelSmooth: true,
	modelColor: "#ff8800",
    
	// Voxel Display
	voxelVisible: true,
	voxelWire: true,
	voxelColorNormal: false,
	voxelColor: "#88ff00",
    
	// Octree Display
	octreeVisible: true,
	octreeWire: true,
    octreeColorNormal: false,
	octreeShowEmpty: false,
	octreeColor: "#0088ff",
    octreeColorEmpty: "#ff8800",

    // Model Options
	modelScale: 8,
    solidify: true,
    
	// Voxel options
	voxelSliceHeight: 4,
	voxelSlicePosition: 0,
    minVoxelScale: 0.5,

	// Octree options
    generateMode: true,
	exploreMode: false,
	octreeLOD: 2,
	distanceFactor: 4.0,
	distanceOffset: 0.0,
    minOctreeDimension: 0.5,
	distanceMax: 40.0,
	distanceVortex: 0.01,
    
	// Helper
	helperDistanceFromCenter: 10,
    showHelper: false,

    //
    autoClearOnChangeModel: true,
	autoUpdate: true,
	paintMode: true,
	modeFPS: false,
    
    // Used to create list
    txt: "...",
    
    // Infos
    voxelCount: "0"
};
