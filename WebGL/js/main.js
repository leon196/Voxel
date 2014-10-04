Array.prototype.clone = function() { return this.slice(0); };

// Setup Content
var cubes = [];

// Setup Three
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// renderer.shadowMapEnabled = true;
// renderer.shadowMapCullFace = THREE.CullFaceBack;

// Setup Parameters
var parameters = new Parameters();

// Setup GUI
initGUI();

// Setup View
camera.position.z = 30;

// Setup Controls
controls = new THREE.OrbitControls( camera );
controls.damping = 0.2;

// Setup Lights
var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 500, 0 );
scene.add( hemiLight );
var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
dirLight.color.setHSL( 0.1, 1, 0.95 );
dirLight.position.set( -1, 10, 1 );
dirLight.position.multiplyScalar( 50 );
scene.add( dirLight );/*
dirLight.castShadow = true;
dirLight.shadowMapWidth = 2048;
dirLight.shadowMapHeight = 2048;
var d = 50;
dirLight.shadowCameraLeft = -d;
dirLight.shadowCameraRight = d;
dirLight.shadowCameraTop = d;
dirLight.shadowCameraBottom = -d;
dirLight.shadowCameraFar = 3500;
dirLight.shadowBias = -0.0001;
dirLight.shadowDarkness = 0.35;*/

// Setup Ground
// var groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
// var groundMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0xffffff, specular: 0x050505 } );
// groundMat.color.setHSL( 0.095, 1, 0.75 );
// var ground = new THREE.Mesh( groundGeo, groundMat );
// ground.rotation.x = -Math.PI/2;
// ground.position.y = -40;
// scene.add( ground );
// ground.receiveShadow = true;

// Setup Assets
var materialBasic = new THREE.MeshBasicMaterial( { color: 0xff8800 } );
var materialBasicRed = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xffdddd, specular: 0xff0066, shininess: 10, shading: THREE.FlatShading } );
var geometryCube = new THREE.BoxGeometry(1,1,1);

var model, octree;
var cubes = [];
var voxels = [];

// Load Mesh
var loader = new THREE.OBJLoader();
loader.load( 'models/mesh.obj', function ( object ) {

	object.traverse( function ( child ) {

	    if ( child.geometry !== undefined ) {

	    	model = child;

	        model.geometry.computeBoundingBox();
	        var bounds = model.geometry.boundingBox;
	        var vertices = model.geometry.vertices.clone();
	        var faces = model.geometry.faces.clone();

	        var scale = parameters.modelScale;

	        model.scale.set(scale, scale, scale);
			model.material = materialBasic;
			// console.log(parameters.modelColor);
			// model.material.color = parameters.modelColor;
			scene.add( model );


			var meshSize = new THREE.Vector3(
				(bounds.max.x - bounds.min.x) * scale,
				(bounds.max.y - bounds.min.y) * scale,
				(bounds.max.z - bounds.min.z) * scale);

			// var octreePosition = {
			// 	x: meshSize.x / 2,
			// 	y: meshSize.y / 2,
			// 	z: meshSize.z / 2 }
			// console.log(meshSize);
			var dimensionMax = Math.max(Math.floor(meshSize.x), Math.max(Math.floor(meshSize.y), Math.floor(meshSize.z)));
			octree = new Octree({x:0, y:0, z:0}, {x:dimensionMax, y:dimensionMax, z:dimensionMax});

			parseVoxel(vertices, faces, meshSize, scale);

			// var lod = 4;
			// var meshSizeLod = {
			// 	x: Math.floor(meshSize.x / lod),
			// 	y: Math.floor(meshSize.y / lod),
			// 	z: Math.floor(meshSize.z / lod)};
			// var voxelCount = meshSize.x * meshSize.y * meshSize.z;
			// for (var i = 0; i < voxelCount; ++i) {

			// }
			// console.log(cubes.length);

			// for (var i = 0; i < cubes.length; ++i) {
			// 	scene.remove(cubes[i]);
			// }

			// cubes = [];

			// var lod = 0;
			// IterateOctree(octree, lod);

			// console.log(cubes.length);
	    }

	} );
});

function updateDisplay()
{
	// Model
	model.visible = parameters.modelVisible;
	model.material.color = new THREE.Color(parameters.modelColor);
	model.material.wireframe = parameters.modelWire;
	model.scale.set(parameters.modelScale, parameters.modelScale, parameters.modelScale);
	// Voxels
	for (var v = 0; v < voxels.length; v++) { voxels[v].updateDisplay(); }
}

// AddCube({x,y,z})
function AddCube(position, dimension, color) {
	var mat = new THREE.MeshBasicMaterial( { color: color, wireframe:parameters.voxelWire } );
	var cube = new THREE.Mesh( geometryCube, mat );
	cube.position.set(position.x, position.y, position.z);
	cube.scale.set(dimension.x, dimension.y, dimension.z);
	cube.material.color = color;
	// cube.castShadow = true;
	// cubes.push(cube);
	// cube.receiveShadow = true;
	scene.add( cube );
	return cube;
}

function IterateOctree(octreeRoot, count) {
	var color = new THREE.Color(1,0,0);
	if (octreeRoot.hasChildren()) {
		for (var i = 0; i < 8; ++i) {
			var octreeChild = octreeRoot.children[i];
			var newDimension = {
				x: octreeChild.halfDimension.x * 2,
				y: octreeChild.halfDimension.y * 2,
				z: octreeChild.halfDimension.z * 2};
			if (count == 0) {
				if (octreeChild.hasChildren() || octreeChild.data != undefined) {
					AddCube(octreeChild.origin, newDimension, new THREE.Color(1,0,0));
				}
			} else {
				IterateOctree(octreeChild, count - 1);
			}
		}
	}
	else if (octreeRoot.data != undefined) {
		var dimension = {
			x: octreeRoot.halfDimension.x * 2,
			y: octreeRoot.halfDimension.y * 2,
			z: octreeRoot.halfDimension.z * 2};
		AddCube(octreeRoot.origin, dimension, new THREE.Color(1,0,0));
	// 	// console.log("count : " + count);
	// 	var point = octreeRoot.data;

	// 	if (count == 0) {
	// 		var newDimension = {
	// 			x: octreeRoot.halfDimension.x * 2.0,
	// 			y: octreeRoot.halfDimension.y * 2.0,
	// 			z: octreeRoot.halfDimension.z * 2.0};

	// 		AddCube(point, newDimension, color);
	// 		// AddCube(octreeRoot.origin, newDimension, new THREE.Color(1,0,0));
	// 	} else {
	// 		var i = octreeRoot.getOctantContainingPoint(point);
	// 		octreeRoot.split();
	// 		IterateOctree(octreeChild, --count);
	// 		// var octreeDepth = new Octree(octreeRoot.origin)
	// 	}
	}
}

// Render
function render() {
	requestAnimationFrame(render);

	// var timer = 0.0005 * Date.now();

	// camera.position.x = Math.cos( timer * 0.3 ) * 40;
	// camera.position.z = Math.sin( timer * 0.3 ) * 40;

	// dirLight.position.x = Math.cos( -timer ) * 600;
	// dirLight.position.z = Math.sin( -timer ) * 600;

	// camera.lookAt( scene.position );

	renderer.render(scene, camera);
}
render();