Array.prototype.clone = function() { return this.slice(0); };
// utils
var sqrt3 = Math.sqrt(3);

var Engine = {};

// Setup Three
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({ antialias: true});
// renderer.sortElements = false;
// renderer.autoClear = false;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Setup Parameters
var parameters = new Parameters();

//
var anchorExploration = { x:0, y:0, z:0 };

// Setup GUI
initGUI();

// Setup View
var viewHalfX, viewHalfY;
camera.position.z = -40;
camera.position.x = camera.position.y = 40;
var cameraLastPosition = { x:camera.position.x, y:camera.position.y, z:camera.position.z };

// Setup Controls
var clock;
var mouseDown = false;
controlOrbit = new THREE.OrbitControls( camera );
controlOrbit.damping = 0.2;
controlOrbit.enabled = !parameters.modeFPS;
var controlFPS = new THREE.FirstPersonControls( camera );
controlFPS.enabled = parameters.modeFPS;

// Setup Raycast
var rayCaster;
var projector = new THREE.Projector();

// Setup Lights
var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 500, 500 );
scene.add( hemiLight );
var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
dirLight.color.setHSL( 0.1, 1, 0.95 );
dirLight.position.set( -1, 10, 1 );
dirLight.position.multiplyScalar( 50 );
scene.add( dirLight );

// Setup Assets
// var textureBrick = THREE.ImageUtils.loadTexture( "textures/BrickOldRounded0134_2_S.jpg" );
// var textureIvy = THREE.ImageUtils.loadTexture( "textures/Ivy0021_5_S.jpg" );
// var textureWood = THREE.ImageUtils.loadTexture( "textures/WoodPlanksBare0171_7_S.jpg" );

// 
var materialMesh = new THREE.MeshPhongMaterial({ color: parameters.modelColor, ambient: 0x030303, specular: 0x660066, shininess: 10 });
var materialVoxel = new THREE.MeshBasicMaterial({ color: parameters.voxelColor, ambient: 0x030303, specular: 0x660066, shininess: 10 });
var materialColorNormal = new THREE.MeshNormalMaterial();
var materialOctree = new THREE.MeshBasicMaterial({ color: parameters.octreeColor, wireframe: parameters.octreeWire });
var materialWire = new THREE.MeshBasicMaterial({ color:0xffffff, wireframe: true });
var materials = [
	new THREE.MeshNormalMaterial(),
	new THREE.MeshBasicMaterial({
		color:0xff3300
	}),
	new THREE.MeshBasicMaterial({
		color:0xcc3300
	}),
	new THREE.MeshBasicMaterial({
		color:0x773300
	})];
var materialsOctree = [
	// new THREE.MeshPhongMaterial({
	// 	color:parameters.octreeColor,
	// 	wireframe: parameters.octreeWire,
	// 	ambient: 0x030303,
	// 	specular: 0x660066, 
	// 	shininess: 10
	// }),
	new THREE.MeshNormalMaterial(),
	new THREE.MeshBasicMaterial({
		color:0xff6600,
		wireframe: parameters.octreeWire
	})];


var geometryCube = new THREE.BoxGeometry(1,1,1);
for (var i = 0; i < geometryCube.faces.length; ++i) { geometryCube.faces[i].materialIndex = 0; }

// Helpers
var helperDistanceExploration = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), materialWire);
// scene.add(helperDistanceExploration);

// Setup Content
var cubes = [];
var rootMeshVoxel = new THREE.Object3D();
var rootGeometryVoxel = new THREE.Geometry();
var rootMeshOctree = new THREE.Object3D();
var rootGeometryOctree = new THREE.Geometry();
var model, octree;
// var cubes = [];
var voxels = [];
var octreeVoxels = [];

function init()
{
	viewHalfX = window.innerWidth / 2;
	viewHalfY = window.innerHeight / 2;
	clock = new THREE.Clock();
}

init();

// Load Mesh
var loader = new THREE.OBJLoader();
loader.load( 'models/cubeOriented.mesh', function ( object ) {

	object.traverse( function ( child ) {

	    if ( child.geometry !== undefined ) {

	    	// Model
	    	model = child;
	        model.scale.set(parameters.modelScale, parameters.modelScale, parameters.modelScale);
			model.material = materialMesh;
			scene.add( model );
    		model.geometry.computeBoundingBox();

			// Voxels
			updateVoxel();

			// Octree
			if (parameters.exploreMode) {
				var bounds = model.geometry.boundingBox;
				anchorExploration = {
					x:(bounds.max.x - bounds.min.x) * parameters.modelScale,
					y:(bounds.max.y - bounds.min.y) * parameters.modelScale,
					z:(bounds.max.z - bounds.min.z) * parameters.modelScale};
				helperDistanceExploration.position.set(anchorExploration.x, anchorExploration.y, anchorExploration.z);
				ExploreOctree(octree, anchorExploration);
			} else {
				IterateOctree(octree, parameters.octreeLOD);
			}

			UpdateRootGeometryVoxel();

			updateLOD(camera.position);

			updateDisplay();

			updateHelper();

			console.log("cubes.length : " + voxels.length);

			render();


			renderer.domElement.addEventListener( 'mousemove', MouseMove, false );
			// this.domElement.addEventListener( 'mousedown', MouseDown, false );
			// this.domElement.addEventListener( 'mousewheel', MouseWheel, false );
	    }

	} );
});

function AddCubeVoxel(position, dimension, materialIndex) {
	var cube = new THREE.Mesh( geometryCube );
	cube.position.set(position.x, position.y, position.z);
	cube.scale.set(dimension.x, dimension.y, dimension.z);
	cube.updateMatrix();
	rootGeometryVoxel.merge(cube.geometry, cube.matrix, materialIndex);
	return cube;
}
function AddCubeOctree(position, dimension, materialIndex) {
	var cube = new THREE.Mesh( geometryCube );
	cube.position.set(position.x, position.y, position.z);
	cube.scale.set(dimension.x, dimension.y, dimension.z);
	cube.updateMatrix();
	rootGeometryOctree.merge(cube.geometry, cube.matrix, materialIndex);
	return cube;
}

var lastTime = Date.now();

// Render
function render() {
	requestAnimationFrame(render);

	var delta = Date.now() - lastTime;

	// var timer = 0.0005 * Date.now();

	// camera.position.x = Math.cos( timer * 0.3 ) * 40;
	// camera.position.z = Math.sin( timer * 0.3 ) * 40;

	// dirLight.position.x = Math.cos( -timer ) * 600;
	// dirLight.position.z = Math.sin( -timer ) * 600;

	// camera.lookAt( scene.position );

	if (parameters.modeFPS) {
		controlFPS.update(clock.getDelta());
	}

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

	renderer.render(scene, camera);

	lastTime = Date.now();
}
function MouseMove(event)
{
	// var cameraDirection = new THREE.Vector3(0, 0, -1);
 //    cameraDirection.applyEuler(camera.rotation, camera.rotation.order);
	var vector = new THREE.Vector3(
		( event.clientX / window.innerWidth ) * 2 - 1,
		- ( event.clientY / window.innerHeight ) * 2 + 1,
		0.5 );
    projector.unprojectVector( vector, camera );
	var dir = vector.sub( camera.position ).normalize();
	rayCaster = new THREE.Raycaster(camera.position, dir);
	var results = rayCaster.intersectObject(model);
	if (results != undefined) {
		if(results.length > 0) {
			updateLOD(results[0].point);
		}
	}
}

function mousedown(event)
{
	mouseDown = true;
}

function mouseup(event)
{
	mouseDown = false;
}