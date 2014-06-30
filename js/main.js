
// Elements
var camera, scene, renderer;
var textureCamera, planeScreen, finalRenderTarget, uniformsRender;
var meshLoaded, geometry, material;
var controls, clock, projector;
var INTERSECTED;
var mouse = { x:0, y:0 };
var viewHalfX, viewHalfY;

// Voxels
var LOD_COUNT = 4;
var voxelsMesh = [];
var VOXEL_SIZE = 1.0;
var GRID_SIZE = 8;

var lines = [];

// Timing
var delayIteration = 0.01;
var lastIteration = -delayIteration;

// Consts
var distMax = VOXEL_SIZE * 2;
var distMin = VOXEL_SIZE * 0.75;
var moveSpeed = 6;
var lookSpeed = 20;
var textureCameraDistance = 400;

init();
render();

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

	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	camera.position = new THREE.Vector3(0, 10, 30);
	scene.add(camera);

	// Control Camera 1
	controls = new THREE.FirstPersonControls(camera);
	controls.movementSpeed = moveSpeed;
	controls.lookSpeed = lookSpeed;
	controls.lookVertical = true;
	controls.mouseDragOn = false;
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

	// Shader Voxel
	vertexShader = document.getElementById( 'vertexShader' ).textContent;
	fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
	// Basic Voxel Shape
	geometry = new THREE.BoxGeometry(VOXEL_SIZE,VOXEL_SIZE,VOXEL_SIZE);
	material = new THREE.ShaderMaterial( { uniforms: {}, attributes: {}, vertexShader: vertexShader, fragmentShader: fragmentShader, transparent: true } );
	material.transparent = true;

	// Voxelize loaded Mesh

	var loader = new THREE.OBJLoader();
	loader.load( 'obj/mesh.wavefront', function ( object ) {
		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				meshLoaded = child;
				voxelsMesh = getVoxelsFromMesh(child.geometry.vertices, child.geometry.faces, 4);
				initParticleSystem(voxelsMesh, 4);
			}
		});
	});

	// Generate
	//generateVoxels();
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

		if (meshLoaded != undefined) {
			var oscillo = 0.1 + (Math.cos(clock.getElapsedTime()) + 1) * 2;
			voxelsMesh = getVoxelsFromMesh(meshLoaded.geometry.vertices, meshLoaded.geometry.faces, oscillo);
			scene.remove(particleSystem);
			initParticleSystem(voxelsMesh, 4 - (Math.cos(clock.getElapsedTime()) + 1) * 2);
		}
	}

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