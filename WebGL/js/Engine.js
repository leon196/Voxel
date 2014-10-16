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

Engine.ready = false;

Engine.OnLoadedMesh = function()
{
    Engine.ready = true;
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

Engine.RayIntersection = function()
{
    var position;
    var direction;
    var mesh;
    // var cameraDirection = new THREE.Vector3(0, 0, -1);
 //    cameraDirection.applyEuler(camera.rotation, camera.rotation.order);

//    if (Engine.lodManager.IsModeMouse())
//    {
        // Calculate direction from mouse position
        var vector = new THREE.Vector3(
            ( Engine.controls.mousePosition.x / window.innerWidth ) * 2 - 1,
            - ( Engine.controls.mousePosition.y / window.innerHeight ) * 2 + 1,
            0.5 );
        Engine.Projector.unprojectVector( vector, Engine.camera );
        
        // 
        position = Engine.camera.position;
        direction = vector.sub( Engine.camera.position ).normalize();
        mesh = Engine.voxelManager.meshVoxel;
//    }
//    else if (Engine.lodManager.IsModeCamera()) 
//    {
//    }
//    // Helper
//    else
//    {
//    }
    
    return (new THREE.Raycaster(position, direction)).intersectObject(mesh);
};

Engine.Render = function()
{
	requestAnimationFrame(Engine.Render);

    var delta = Date.now() - Engine.elpasedTimeLastFrame;

	if (!Engine.controls.IsModeOrbit()) {
		Engine.controls.Update();
	}

	Engine.renderer.render(Engine.scene, Engine.camera);

	Engine.elpasedTimeLastFrame = Date.now();
}

// Start
Engine.Init();
Engine.Render();