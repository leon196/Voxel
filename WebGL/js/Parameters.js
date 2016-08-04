Engine.MaxRange = 128;
Engine.MaxBounds = new Engine.Vector3(Engine.MaxRange, Engine.MaxRange, Engine.MaxRange);
Engine.MaxLength = Engine.MaxRange * Engine.MaxRange * Engine.MaxRange;


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
	voxelVisible: false,
	voxelWire: true,
	voxelColorNormal: false,
	voxelColor: "#88ff00",
    
	// Octree Display
	octreeVisible: false,
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
	octreeLOD: 2,
	distanceFactor: 1.0,
	distanceOffset: 0.0,
    minOctreeDimension: 0.5,
	distanceMax: 40.0,
	distanceVortex: 0.0,
    distancePower:1,
    distanceLog:1,
    pow: false,
    sqrt: false,
    distanceLogScale: 4,
    vortexMode: false,
    
	// Helper
	helperDistanceFromCenter: 10,
    showHelper: false,

    //
    generateMode: false,
	exploreMode: true,
    autoClearOnChangeModel: true,
	autoUpdate: true,
    exploreModeAutoUpdate: true,
	paintMode: false,
    octreeEnabled: false,
    
    controlsEnabled: true,
	modeFPS: false,
    
    
    // Used to create list
    txt: "...",
    
    // Infos
    voxelCount: "0"
};
