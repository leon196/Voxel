
// Elements
var camera, scene, renderer;
var textureCamera, planeScreen, finalRenderTarget, uniformsRender;
var controls, clock, projector;
var INTERSECTED;
var mouse = { x:0, y:0 };
var mouseDown = false;
var viewHalfX, viewHalfY;

// Voxels
var LOD_COUNT = 4;
var voxelsMesh = [];
var VOXEL_SIZE = 1;
var GRID_SIZE = 8;

var lines = [];

var gameObjects = [];
var monkey;

// Timing
var delayIteration = 0.01;
var lastIteration = -delayIteration;

// Consts
var distMax = VOXEL_SIZE * 2;
var distMin = VOXEL_SIZE * 0.75;
var moveSpeed = 40;
var lookSpeed = 20;
var textureCameraDistance = 400;

// Debug cube
var debug;

init();
render();

$( document ).ready(function() {
	
	$( "#grid_size_plus" ).click(function() {
		if (document.getElementById("grid_size").value < 20) {
			document.getElementById("grid_size").value++;
			GRID_SIZE = document.getElementById("grid_size").value;
		}
	});
	
	$( "#grid_size_minus" ).click(function() {
		if (document.getElementById("grid_size").value > 0) {
			document.getElementById("grid_size").value--;
			GRID_SIZE = document.getElementById("grid_size").value;
		}
	});
	
	$( "#voxel_size_plus" ).click(function() {
		if (document.getElementById("voxel_size").value < 20) {
			document.getElementById("voxel_size").value++;
			VOXEL_SIZE = document.getElementById("voxel_size").value;
		}
	});
	
	$( "#voxel_size_minus" ).click(function() {
		if (document.getElementById("voxel_size").value > 0) {
			document.getElementById("voxel_size").value--;
			VOXEL_SIZE = document.getElementById("voxel_size").value;
		}
	});
	
	$( "#lod_plus" ).click(function() {
		if (document.getElementById("lod_level").value < 5) {
			document.getElementById("lod_level").value++;
			LOD_COUNT = document.getElementById("lod_level").value;
		}
	});
	
	$( "#lod_minus" ).click(function() {
		if (document.getElementById("lod_level").value > 0) {
			document.getElementById("lod_level").value--;
			LOD_COUNT = document.getElementById("lod_level").value;
		}
	});
	
	$( "#erase_mode" ).click(function() {
	  ERASE_MODE = document.getElementById("erase_mode").checked;
	  if (ERASE_MODE) console.log("Erase mode activated !");
	});
});

function init()
{
	clock = new THREE.Clock();
	viewHalfX = window.innerWidth / 2;
	viewHalfY = window.innerHeight / 2;
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 75, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;

	// initialize object to perform world/screen calculations
	projector = new THREE.Projector();

	// Setup Render
	renderer = new THREE.WebGLRenderer({ antialias:true, alpha: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// Setup Scene 
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

	// Lights
	scene.add( new THREE.AmbientLight( 0x444444 ) );
	var light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
	light1.position.set( 1, 1, 1 );
	scene.add( light1 );
	var light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
	light2.position.set( 0, -1, 0 );
	scene.add( light2 );

	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	camera.position = new THREE.Vector3(0, 10, 110);
	scene.add(camera);

	// Control Camera 1
	controls = new THREE.FirstPersonControls(camera);
	controls.movementSpeed = moveSpeed;
	controls.lookSpeed = lookSpeed;
	controls.lookVertical = true;
	controls.mouseDragOn = true;
	controls.lon = -90;

	// Render to Texture
	finalRenderTarget = new THREE.WebGLRenderTarget( 1024, 1024, { format: THREE.RGBAFormat, alpha: true } );
	// Shaders
	var vertexShader = document.getElementById( 'vertexRender' ).textContent;
	var fragmentShader = document.getElementById( 'fragmentRender' ).textContent;
	var textureShader = THREE.ImageUtils.loadTexture( "textures/hoho.jpg" );
	textureShader.magFilter = THREE.NearestFilter;
	uniformsRender = {
		texture: { type: "t", value: textureShader  },
		transitionAlpha : { type: "f", value: 0.0} };
	// Diplay Rendered Texture on Screen with a Plane
	var planeSize = 1.5;
	var planeGeometry = new THREE.PlaneGeometry(ASPECT * planeSize, planeSize);
	var planeMaterial = new THREE.ShaderMaterial( { uniforms: uniformsRender, attributes: {}, vertexShader: vertexShader, fragmentShader: fragmentShader, antialias:false } );
	planeMaterial.transparent = true;
	planeScreen = new THREE.Mesh( planeGeometry, planeMaterial );
	planeScreen.position.z = -1.0;

	// Camera used for Rendered Texture
	textureCamera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	textureCamera.position = new THREE.Vector3(0, 0, textureCameraDistance);
	textureCamera.lookAt(new THREE.Vector3(0,0,0));

	camera.add(planeScreen);
	camera.add(textureCamera);

	// 
	monkey = new GameObject();
	monkey.initWithMesh('obj/mesh.wavefront');

// Debug

	debug = CreateCubeWired(new THREE.Vector3());
}

function render()
{
	requestAnimationFrame(render);

	controls.update(clock.getDelta());

	update();

	renderer.render(scene, camera);
}

function update()
{

	// Behaviors
	if (lastIteration + delayIteration < clock.getElapsedTime())
	{
		lastIteration = clock.getElapsedTime();

		var oscillo = (Math.cos(clock.getElapsedTime()) + 1) * 0.8;
		//monkey.moveTo({x:0, y:0, z:oscillo * 100});
		//monkey.rotateTo({x:oscillo * 3.14, y:0, z:0});
		//monkey.updateParticleSystem(oscillo);
/*
		if (meshLoaded != undefined) {
			voxelsMesh = getVoxelsFromMesh(meshLoaded.geometry.vertices, meshLoaded.geometry.faces, oscillo);
			//scene.remove(particleSystem);
			updateParticleSystem(4 - (Math.cos(clock.getElapsedTime()) + 1) * 2);
		}
		*/
	}

	if (mouseDown) {
		paint();
	}
/*
	if (monkey.particleSystem != undefined) {
		var distancePlayer = monkey.nearestVoxelFrom(camera.position);
		var scale = Math.max(0, (100 - distancePlayer) / 10);
		monkey.updateParticleSystem(scale);
	}
*/
}

function mousemove( event )
{
	mouse = { x:event.pageX - viewHalfX, y:event.pageY - viewHalfY };
}

function mousedown(event)
{
	mouseDown = true;
}

function mouseup(event)
{
	mouseDown = false;
}

function paint ()
{
	var dist = 20;
	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );
	var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() ).ray;
	//var step = 3;
	
	var cursor = { 	x: camera.position.x + ray.direction.x * dist,
					y: camera.position.y + ray.direction.y * dist,
					z: camera.position.z + ray.direction.z * dist }
	debug.position.set(cursor.x, cursor.y, cursor.z);
	debug.position.matrixNeedsUpdate = true;
	//for (var i = 0; i < dist; i++) {
	var indexes = monkey.isVoxelHere(cursor, 0.2);
	if (indexes.length > 0) {
		monkey.eraseVoxels(indexes);
	}
	//}
}