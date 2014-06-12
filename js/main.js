
// Elements
var camera, scene, renderer;
var textureCamera, planeScreen, finalRenderTarget, uniformsRender;
var geometry, material;
var controls, clock, projector;
var INTERSECTED;
var mouse = { x:0, y:0 };
var viewHalfX, viewHalfY;

// Voxels
var voxels = [];
var voxelSize = 11.0;
var gridSize = 8;

// Consts
var distMax = voxelSize * 2;
var distMin = voxelSize * 0.75;
var moveSpeed = 60;
var lookSpeed = 20;

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
	camera.position = new THREE.Vector3(0, 0, 100);
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
	uniformsRender = {
		texture: { type: "t", value: finalRenderTarget  },
		transitionAlpha: { type: "f", value: 0.0}};
	// Diplay Rendered Texture on Screen with a Plane
	var planeSize = voxelSize;
	var planeGeometry = new THREE.PlaneGeometry(ASPECT * planeSize, planeSize);
	var planeMaterial = new THREE.ShaderMaterial( { uniforms: uniformsRender, attributes: {}, vertexShader: vertexShader, fragmentShader: fragmentShader, antialias:false } );
	planeMaterial.transparent = true;
	planeScreen = new THREE.Mesh( planeGeometry, planeMaterial );
	planeScreen.position.z = -1.0;

	// Camera used for Rendered Texture
	textureCamera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	textureCamera.position = new THREE.Vector3(0, 0, 1000);
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
		voxel.name = randIndex;

		scene.add(voxel);
		voxels.push(voxel);
	}
}

function render()
{
	requestAnimationFrame(render);

	planeScreen.visible = false;
	renderer.render( scene, textureCamera, finalRenderTarget, true );
	planeScreen.visible = true;

	controls.update(clock.getDelta());

	update();

	//planeScreen.rotation.y = Math.cos(clock.getElapsedTime());

	renderer.render(scene, camera);
}

function update()
{

	if (controls.object.id != textureCamera.id) {

		var nearestVoxel = null;
		var nearestDist = 1000.0;
		for (var i = 0; i < voxels.length; i++) {
			var distObject = camera.position.distanceTo(voxels[i].position);
			if (distObject < distMax && nearestDist > distObject) {
				nearestVoxel = voxels[i];
				nearestDist = distObject;
			}
		}

		if (nearestVoxel != null) {

			var ratio = Math.max(0, nearestDist / distMax);
			
			// Slow Down on Face
			controls.movementSpeed = moveSpeed * (ratio - distMin / distMax);
			controls.lookSpeed = lookSpeed * (ratio - distMin / distMax);

			// Scale Plane Renderer
			var invert = 1.0 - Math.max(0, Math.min(ratio + distMin / distMax, 1));
			uniformsRender.transitionAlpha.value = invert;

			if (controls.movementSpeed < 1.0) {
				controls.object = textureCamera;
				controls.movementSpeed = moveSpeed;
				controls.lookSpeed = lookSpeed * 0.1;
				uniformsRender.transitionAlpha.value = 1.0;
			}
		}
	}
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

function lerp(start, end, percent)
{
     return (start + percent*(end - start));
}

function intersection()
{
	// find intersections
	// create a Ray with origin at the mouse position
	//   and direction into the scene (camera direction)
	var vector = new THREE.Vector3( mouse.X, mouse.Y, 1 );
	projector.unprojectVector( vector, camera );
	var direction = vector.sub( camera.position ).normalize()
	var ray = new THREE.Raycaster( camera.position, direction );

	// create an array containing all objects in the scene with which the ray intersects
	var intersects = ray.intersectObjects( voxels );
	
	// if there is one (or more) intersections
	if ( intersects.length > 0 )
	{
		// if the closest object intersected is not the currently stored intersection object
		if ( intersects[ 0 ].object != INTERSECTED ) 
		{
			// store reference to closest object as current intersection object
			INTERSECTED = intersects[ 0 ].object;
		}
	} else {
		INTERSECTED = null;
	}

	if (INTERSECTED != null) {
	}
}