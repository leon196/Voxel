
// Elements
var camera, scene, renderer;
var textureCamera, planeScreen, finalRenderTarget;
var geometry, material;
var controls, clock;

// Voxels
var voxels = [];
var voxelSize = 11;
var gridSize = 8;

init();
render();

function init()
{
	clock = new THREE.Clock();
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 75, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;

	// Setup Render
	renderer = new THREE.WebGLRenderer({ antialias:true, alpha: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// Setup Scene 
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	camera.position = new THREE.Vector3(-100, 0, 0);
	camera.lookAt(new THREE.Vector3(0,0,0));
	scene.add(camera);

	// Controls
	controls = new THREE.FirstPersonControls(camera);
	controls.movementSpeed = 60;
	controls.lookSpeed = 20;
	controls.lookVertical = true;
	controls.mouseDragOn = false;
	controls.freeze = true;

	// Render to Texture
	finalRenderTarget = new THREE.WebGLRenderTarget( 1024, 1024, { format: THREE.RGBAFormat, alpha: true } );
	// Shaders
	var vertexShader = document.getElementById( 'vertexRender' ).textContent;
	var fragmentShader = document.getElementById( 'fragmentRender' ).textContent;
	var uniforms = { texture: { type: "t", value: finalRenderTarget  } };
	// Diplay Rendered Texture on Screen with a Plane
	var planeSize = voxelSize;
	var planeGeometry = new THREE.PlaneGeometry(ASPECT * planeSize, planeSize);
	var planeMaterial = new THREE.ShaderMaterial( { uniforms: uniforms, attributes: {}, vertexShader: vertexShader, fragmentShader: fragmentShader, antialias:false } );
	planeMaterial.transparent = true;
	planeScreen = new THREE.Mesh( planeGeometry, planeMaterial );
	planeScreen.position.z = -1.0;
	// Camera used for Rendered Texture
	textureCamera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	textureCamera.position.z = 100;
	textureCamera.lookAt(new THREE.Vector3(0,0,0));

	camera.add(planeScreen);
	camera.add(textureCamera);

	// Shader Voxel
	vertexShader = document.getElementById( 'vertexShader' ).textContent;
	fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
	// Basic Voxel Shape
	geometry = new THREE.BoxGeometry(voxelSize,voxelSize,voxelSize);
	material = new THREE.ShaderMaterial( { uniforms: {}, attributes: {}, vertexShader: vertexShader, fragmentShader: fragmentShader, transparent: true } );
	material.transparent = true;

	// Generate
	generateVoxels();
}

function getGridPosition(index)
{
	return new THREE.Vector3 (
			voxelSize * (index % gridSize),
			voxelSize * (Math.floor(index / gridSize) % gridSize),
			voxelSize * (Math.floor(index / (gridSize*gridSize)) % gridSize));
}

function generateVoxels()
{
	var halfGrid = gridSize * voxelSize * -0.5;
	var randCount = Math.ceil(50 + Math.random() * 100);
	for (var i = 0; i < randCount; i++) {
		var voxel = new THREE.Mesh( geometry, material );

		var randIndex = Math.floor(Math.random() * gridSize * gridSize * gridSize);

		voxel.position = getGridPosition(randIndex);// - new THREE.Vector3(halfGrid, halfGrid, halfGrid);

		scene.add(voxel);
		voxels.push({object:voxel, index:randIndex});
	}
}

function render()
{
	requestAnimationFrame(render);

	planeScreen.visible = false;
	renderer.render( scene, textureCamera, finalRenderTarget, true );
	planeScreen.visible = true;

	controls.update(clock.getDelta());

	//planeScreen.rotation.y = Math.cos(clock.getElapsedTime());

	renderer.render(scene, camera);
}

function CreateCubeWired(position)
{
	// setup shader uniforms
	var uniforms = { time: { type: 'f', value: clock.getElapsedTime() } };
	// setup shader attributes
	var attributes = { center: { type: 'v3', boundTo: 'faceVertices', value: [] }  };
	// setup face barycentre (for easy wireframe)
	var centerValues = attributes.center.value;
	for( var f = 0; f < geometry.faces.length; f ++ ) {
		centerValues[ f ] = [ new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 1 ) ];
		geometry.faceVertexUvs[0][f].push(new THREE.Vector2(0,0));
		geometry.faceVertexUvs[0][f].push(new THREE.Vector2(0,1));
		geometry.faceVertexUvs[0][f].push(new THREE.Vector2(1,0));
	}
	geometry.uvNeedUpdate = true;
	// setup material
	var mat = new THREE.ShaderMaterial( { uniforms: {}, attributes: {}, vertexShader: vertexShader, fragmentShader: fragmentShader } );
	// setup mesh
	var cube = new THREE.Mesh( geometry, mat );
	// place the cube in scene
	cube.position = position;
	scene.add(cube);
	return cube
}

function mousedown(event)
{
	mouseDown = true;
}

function mouseup(event)
{
	mouseDown = false;
}