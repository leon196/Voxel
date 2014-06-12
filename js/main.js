
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
var voxelsBuffer = [];
var voxelSize = 11.0;
var gridSize = 8;

// Timing
var delayIteration = 0.5;
var lastIteration = -delayIteration;

// Consts
var distMax = voxelSize * 2;
var distMin = voxelSize * 0.75;
var moveSpeed = 60;
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

function getIndexPosition(position)
{
	return Math.floor((position.x + position.y * gridSize + position.z * gridSize * gridSize) / voxelSize);
}

function generateVoxels()
{
	var count = gridSize*gridSize*gridSize;

	for (var i = 0; i < count; i++) {
		var voxel = { mesh: null, status: 0 };

		if (Math.random() < 0.25) {
			var mesh = new THREE.Mesh( geometry, material );
			mesh.position = getGridPosition(i);
			scene.add(mesh);

			voxel.mesh = mesh;
			voxel.status = 1;
		}

		voxels.push(voxel);
		voxelsBuffer.push(voxel.status);
	}
}

function getNeighborCount(index)
{
	var count = 0;
	var position = getGridPosition(index);
	var neighbors = [
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y, position.z)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y, position.z)),
		getIndexPosition(new THREE.Vector3(position.x, position.y - voxelSize, position.z)),
		getIndexPosition(new THREE.Vector3(position.x, position.y + voxelSize, position.z)),
		getIndexPosition(new THREE.Vector3(position.x, position.y, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x, position.y, position.z + voxelSize)),

		getIndexPosition(new THREE.Vector3(position.x, position.y - voxelSize, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x, position.y - voxelSize, position.z + voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x, position.y + voxelSize, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x, position.y + voxelSize, position.z + voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y, position.z + voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y - voxelSize, position.z)),
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y + voxelSize, position.z)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y, position.z + voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y - voxelSize, position.z)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y + voxelSize, position.z)),
/*
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y - voxelSize, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y - voxelSize, position.z + voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y + voxelSize, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y - voxelSize, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y + voxelSize, position.z + voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y + voxelSize, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y - voxelSize, position.z + voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y + voxelSize, position.z + voxelSize))
*/
	];
	for (var n = neighbors.length; n >= 0; n--) {
		if (neighbors[n] >= 0 && neighbors[n] < gridSize*gridSize*gridSize) {
			count += voxels[neighbors[n]].status;
		}
	}
	return count;
}

function iterateGameOfLife()
{
	var count = gridSize * gridSize * gridSize;
	for (var i = 0; i < count; i++) {
		var neighborCount = getNeighborCount(i);

		// Dead
		if (voxelsBuffer[i] == 0) {
			// Birth
			if (neighborCount == 2) {
				voxels[i].status = 1;
				if (voxels[i].mesh == null) {
					var mesh = new THREE.Mesh( geometry, material );
					mesh.position = getGridPosition(i);
					scene.add(mesh);
					voxels[i].mesh = mesh;
				} else {
					voxels[i].mesh.visible = true;
				}
			}
		}
		// Alive
		else {
			// Death
			if (neighborCount != 2 && neighborCount != 3) {
				voxels[i].status = 0;
				if (voxels[i].mesh != null) {
					voxels[i].mesh.visible = false;
				}
			}
		}
	}

	for (var i = 0; i < count; i++) {
		voxelsBuffer[i] = voxels[i].status;
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

	renderer.render(scene, camera);
}

function update()
{
	// Behaviors
	if (lastIteration + delayIteration < clock.getElapsedTime()) {
		//iterateGameOfLife();
		lastIteration = clock.getElapsedTime();
	}

	// Controls
	if (controls.object.id != textureCamera.id) {

		var nearestVoxel = null;
		var nearestDist = 1000.0;
		for (var i = 0; i < voxels.length; i++) {
			var voxel = voxels[i].mesh;
			if (voxel) {
				var distObject = camera.position.distanceTo(voxel.position);
				if (distObject < distMax && nearestDist > distObject) {
					nearestVoxel = voxel;
					nearestDist = distObject;
				}
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
	} else {
		if (textureCamera.position.length() < gridSize * voxelSize) {
			camera.position.x += textureCamera.position.x;
			camera.position.y += textureCamera.position.y;
			camera.position.z += textureCamera.position.z;
			controls.object = camera;
			controls.movementSpeed = moveSpeed;
			controls.lookSpeed = lookSpeed;
			uniformsRender.transitionAlpha.value = 0.0;

			textureCamera.position = new THREE.Vector3(0, 0, textureCameraDistance);
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