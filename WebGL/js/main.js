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

// Setup View
camera.position.z = 100;

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
var materialBasic = new THREE.MeshBasicMaterial( { color: 0x6600FF, wireframe: true } );
var materialBasicRed = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xffdddd, specular: 0xff0066, shininess: 10, shading: THREE.FlatShading } );
var geometryCube = new THREE.BoxGeometry(1,1,1);

var octree;
var cubes = [];

// Load Mesh
var loader = new THREE.OBJLoader();
loader.load( 'models/mesh.obj', function ( object ) {

	object.traverse( function ( child ) {

	    if ( child.geometry !== undefined ) {

	        child.geometry.computeBoundingBox();
	        var bounds = child.geometry.boundingBox;
	        var vertices = child.geometry.vertices.clone();
	        var faces = child.geometry.faces.clone();

	        var scale = 4;

	        child.scale.set(scale, scale, scale);
			child.material = materialBasic;
			scene.add( child );

			var meshSize = new THREE.Vector3(
				(bounds.max.x - bounds.min.x) * scale,
				(bounds.max.y - bounds.min.y) * scale,
				(bounds.max.z - bounds.min.z) * scale);

			// var octreePosition = {
			// 	x: meshSize.x / 2,
			// 	y: meshSize.y / 2,
			// 	z: meshSize.z / 2 }
			// console.log(meshSize);

			octree = new Octree({x:0, y:0, z:0}, {x:Math.ceil(meshSize.x), y:Math.ceil(meshSize.y), z:Math.ceil(meshSize.z)});

			parseVoxel(vertices, faces, meshSize, scale);

			// var lod = 4;
			// var meshSizeLod = {
			// 	x: Math.floor(meshSize.x / lod),
			// 	y: Math.floor(meshSize.y / lod),
			// 	z: Math.floor(meshSize.z / lod)};
			// var voxelCount = meshSize.x * meshSize.y * meshSize.z;
			// for (var i = 0; i < voxelCount; ++i) {

			// }
			console.log(cubes.length);

			// for (var i = 0; i < cubes.length; ++i) {
			// 	scene.remove(cubes[i]);
			// }

			// cubes = [];

			// IterateOctree(octree, 16);

			// console.log(cubes.length);
	    }

	} );
});

// AddCube({x,y,z})
function AddCube(position, dimension, color) {
	var mat = new THREE.MeshBasicMaterial( { color: color/*, wireframe:true*/ } );
	var cube = new THREE.Mesh( geometryCube, mat );
	cube.position.set(position.x, position.y, position.z);
	cube.scale.set(dimension.x, dimension.y, dimension.z);
	cube.castShadow = true;
	cube.material.color = color;
	cubes.push(cube);
	// cube.receiveShadow = true;
	scene.add( cube );
}

function IterateOctree(octreeRoot, count) {
	// if (octreeRoot != undefined) {
		if (!octreeRoot.isLeafNode()) {
			for (var i = 0; i < 8; ++i) {
				var octreeChild = octreeRoot.children[i];
				if (count == 0) {
					var newDimension = {
						x: octreeChild.halfDimension.x * 2.0,
						y: octreeChild.halfDimension.y * 2.0,
						z: octreeChild.halfDimension.z * 2.0};
					if (!octreeChild.isLeafNode()) {
						AddCube(octreeChild.origin, newDimension, new THREE.Color(1,0,0));
					} else {
						if (octreeChild.data != undefined ) {
							var point = octreeChild.data;
							AddCube(point, newDimension, new THREE.Color(1,0,0));
						}
					}
				} else {
					IterateOctree(octreeChild, --count);
				}
			}
		} else if (octreeRoot.data != undefined) {
			var newDimension = {
				x: octreeRoot.halfDimension.x * 2.0,
				y: octreeRoot.halfDimension.y * 2.0,
				z: octreeRoot.halfDimension.z * 2.0};
			var point = octreeRoot.data;
			AddCube(point, newDimension, new THREE.Color(1,0,0));
		}
	// }
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