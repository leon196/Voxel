// Setup Three
Engine.scene = new THREE.Scene();
Engine.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
Engine.renderer = new THREE.WebGLRenderer({ antialias: true});
Engine.renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( Engine.renderer.domElement );

// Hemi Light
Engine.HemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
Engine.HemiLight.color.setHSL( 0.6, 1, 0.6 );
Engine.HemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
Engine.HemiLight.position.set( 0, 500, 500 );
Engine.scene.add( Engine.HemiLight );

// Directional Light
Engine.DirLight = new THREE.DirectionalLight( 0xffffff, 1 );
Engine.DirLight.color.setHSL( 0.1, 1, 0.95 );
Engine.DirLight.position.set( -1, 10, 1 );
Engine.DirLight.position.multiplyScalar( 50 );
Engine.scene.add( Engine.DirLight );


Engine.Init = function()
{    
    // Instances
    Engine.modelManager = new Engine.ModelManager();
    Engine.modelManager.Init();
    
    Engine.voxelManager = new Engine.VoxelManager();
    Engine.voxelManager.Init();
    
    Engine.octreeManager = new Engine.OctreeManager();
    Engine.octreeManager.Init();
    
    Engine.lodManager = new Engine.LodManager();
    
    Engine.controls = new Engine.Controls();
    Engine.controls.Init(Engine.camera);
    
    Engine.interface = new Engine.Interface();
    
    Engine.helper = new Engine.Helper();
    Engine.helper.Init();
};

Engine.OnLoadedMesh = function()
{
    Engine.Update();
};

Engine.Update = function()
{
    // Update Data
    Engine.modelManager.Update();
    
    Engine.voxelManager.UpdateModel();
    
    Engine.octreeManager.UpdatePoints();
    Engine.octreeManager.Update();
    
//    Engine.controls.UpdateTarget();
};

Engine.Clear = function()
{
    Engine.voxelManager.Clear();
    Engine.octreeManager.Clear();
};

Engine.Render = function()
{
	requestAnimationFrame(Engine.Render);

//	var delta = Date.now() - Engine.elpasedTimeLastFrame;

	// var timer = 0.0005 * Date.now();

	// camera.position.x = Math.cos( timer * 0.3 ) * 40;
	// camera.position.z = Math.sin( timer * 0.3 ) * 40;

	// dirLight.position.x = Math.cos( -timer ) * 600;
	// dirLight.position.z = Math.sin( -timer ) * 600;

	// camera.lookAt( scene.position );

//	if (Engine.Parameters.modeFPS) {
//		controlFPS.update(Engine.Clock.getDelta());
//	}

	// Update Local Level of Details
	/*
	if (Math.round(camera.position.x) != cameraLastPosition.x
		|| Math.round(camera.position.y) != cameraLastPosition.y
		|| Math.round(camera.position.z) != cameraLastPosition.z) {
		updateLOD(camera.position);
		cameraLastPosition.x = Math.round(camera.position.x);
		cameraLastPosition.y = Math.round(camera.position.y);
		cameraLastPosition.z = Math.round(camera.position.z);
	}*/

	Engine.renderer.render(Engine.scene, Engine.camera);

	Engine.elpasedTimeLastFrame = Date.now();
}

// Start
Engine.Init();
Engine.Render();