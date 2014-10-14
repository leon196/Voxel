Engine.MaxRange = 16;
Engine.MaxBounds = new Engine.Vector3(Engine.MaxRange, Engine.MaxRange, Engine.MaxRange);
Engine.MaxLength = Engine.MaxRange * Engine.MaxRange * Engine.MaxRange;


Engine.Parameters =
{
    globalColorAmbient: "#030303",
    globalColorSpecular: "#660066",
    globalShininess: 10,
    
	// Model Display
	modelVisible: false, 
	modelWire: false,
	modelSmooth: true,
	modelColor: "#ff8800",
    
	// Voxel Display
	voxelVisible: false,
	voxelWire: true,
	voxelColorNormal: false,
	voxelColor: "#88ff00",
    
	// Octree Display
	octreeVisible: true,
	octreeWire: false,
    octreeColorNormal: true,
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
    generateMode: false,
	exploreMode: true,
	octreeLOD: 2,
	distanceFactor: 30.0,
	distanceOffset: 0.0,
    minOctreeDimension: 0.5,
	distanceMax: 40.0,
	distanceVortex: 0.0,
    distancePower:1,
    vortexMode: false,
    
	// Helper
	helperDistanceFromCenter: 10,
    showHelper: false,

    //
    autoClearOnChangeModel: true,
	autoUpdate: true,
    exploreModeAutoUpdate: true,
	paintMode: true,
	modeFPS: false,
    
    // Used to create list
    txt: "...",
    
    // Infos
    voxelCount: "0"
};
