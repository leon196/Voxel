
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
var voxels = [];
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
	geometry = new THREE.BoxGeometry(VOXEL_SIZE,VOXEL_SIZE,VOXEL_SIZE);
	material = new THREE.ShaderMaterial( { uniforms: {}, attributes: {}, vertexShader: vertexShader, fragmentShader: fragmentShader, transparent: true } );
	material.transparent = true;

	// Voxelize loaded Mesh
	var loader = new THREE.OBJLoader();
	loader.load( 'obj/mesh.wavefront', function ( object ) {
		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				meshLoaded = child.geometry;
				voxelize(child.geometry.vertices, child.geometry.faces, 10);
			}
		});
	});

	// Generate
	//generateVoxels();

}

function getGridPosition(index, lod)
{
	var gSize = GRID_SIZE / Math.pow(2, lod);
	var vSize = VOXEL_SIZE * Math.pow(2, lod);//(2 * lod));
	return new THREE.Vector3 (
			vSize * ((index % gSize)),
			vSize * ((Math.floor(index / gSize) % gSize)),
			vSize * ((Math.floor(index / (gSize*gSize)) % gSize)));
}

function getIndexPosition (position)
{
	return Math.floor((position.x
					 + position.y * GRID_SIZE
					 + position.z * GRID_SIZE * GRID_SIZE) / VOXEL_SIZE);
}

function LODTest (index, lod)
{
	/*
	var pos = getGridPosition(index, lod);
	for (var x = 0; x < 3; x++) {
		for (var y = 0; y < 3; y++) {
			for (var z = 0; z < 3; z++) {
				var i = getIndexPosition(new THREE.Vector3(pos.x + x, pos.y + y, pos.z + z));
				if (voxels[0][i].status == 1) {
					return true;
				}
			}
		}
	}*/
	var i = Math.floor(index * GRID_SIZE * GRID_SIZE * GRID_SIZE);
	if (voxels[0][i].status == 1) {
		return true;
	} else {
		return false;
	}

}

function CreateVoxelMesh (index, lod)
{
	var mesh = new THREE.Mesh( geometry, material );
	mesh.position = getGridPosition(index, lod);
	var scale = Math.pow(2, lod);
	mesh.scale.set(scale, scale, scale);
	scene.add(mesh);
	return mesh;
}

function generateVoxels ()
{
	voxels = [];

	for (var l = 0; l < LOD_COUNT; l++)
	{
		voxels.push([]);
		var count = Math.pow(GRID_SIZE / Math.pow(2, l), 3);

		for (var i = 0; i < count; i++)
		{
			var voxel = { mesh: null, status: 0 };
			var thereIsAVoxel = false;

			// LEVEL OF DETAILS 0
			if (l == 0) {
				if (Math.random() < 0.25) {
					thereIsAVoxel = true;
				}
			}
			// LEVELS OF DETAILS HIGHER
			else if (LODTest(i/count, l)) {
				thereIsAVoxel = true;
			}

			if (thereIsAVoxel) {
				var mesh = CreateVoxelMesh(i, l);
				voxel.mesh = mesh;
				voxel.status = 1;
			}

			voxels[l].push(voxel);
			//voxelsBuffer.push(voxel.status);
		}
	}
}

function showLOD(lod) 
{
	// For each level of details
	for (var i = 0; i < LOD_COUNT; i++) {
		var show = i == lod;
		var count = voxels[i].length;
		// For each voxels
		for (var v = 0; v < count; v++) {
			var voxel = voxels[i][v];
			if (voxel.mesh != null)
				voxel.mesh.visible = show;
		}
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

var lodCurrent = 0;

function update()
{
	// Behaviors
	if (lastIteration + delayIteration < clock.getElapsedTime()) {
		//iterateGameOfLife();
		lastIteration = clock.getElapsedTime();
		//var lod = Math.floor(LOD_COUNT * (Math.cos(clock.getElapsedTime()) + 1.0) * 0.5);
		lodCurrent = (lodCurrent + 1) % LOD_COUNT;
		//showLOD(lodCurrent);

		if (meshLoaded != undefined) {
			for (var i = 0; i < lines.length; i++) {
				scene.remove(lines[i]);
			}		
			lines = [];
			voxelize(meshLoaded.vertices, meshLoaded.faces, 4 + (Math.cos(clock.getElapsedTime()) + 1) * 10);
			console.log("voxels : " + lines.length);
		}
/*
		for (var i = 0; i < lines.length; i++) {
			scene.remove(lines[i]);
		}
		testLine(new THREE.Vector3(Math.cos(clock.getElapsedTime()) * 10, 10a, Math.sin(clock.getElapsedTime()) * 10), new THREE.Vector3(0, 20, 0));*/
	}

	// Controls
/*
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
*/
		if (textureCamera.position.length() < GRID_SIZE * VOXEL_SIZE) {
			camera.position.x += textureCamera.position.x;
			camera.position.y += textureCamera.position.y;
			camera.position.z += textureCamera.position.z;
			controls.object = camera;
			controls.movementSpeed = moveSpeed;
			controls.lookSpeed = lookSpeed;
			uniformsRender.transitionAlpha.value = 0.0;

			textureCamera.position = new THREE.Vector3(0, 0, textureCameraDistance);
		}
	//}
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