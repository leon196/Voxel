Array.prototype.clone = function() { return this.slice(0); };

// Setup Three
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

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
scene.add( dirLight );

// Setup Assets
var materialMesh = new THREE.MeshPhongMaterial({ ambient: 0x030303, color: parameters.modelColor, specular: 0x660066, shininess: 10 });
// var materialVoxel = new THREE.MeshNormalMaterial();
var materialVoxel = new THREE.MeshPhongMaterial({ ambient: 0x030303, color: parameters.voxelColor, specular: 0x660066, shininess: 10 });
// var materialOctree = new THREE.MeshNormalMaterial();
var materialOctree = new THREE.MeshPhongMaterial({ ambient: 0x030303, color: parameters.octreeColor, specular: 0x660066, shininess: 10 });
var geometryCube = new THREE.BoxGeometry(1,1,1);


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

// Load Mesh
var loader = new THREE.OBJLoader();
loader.load( 'models/mesh.obj', function ( object ) {

	object.traverse( function ( child ) {

	    if ( child.geometry !== undefined ) {

	    	// Model
	    	model = child;
	        model.scale.set(parameters.modelScale, parameters.modelScale, parameters.modelScale);
			model.material = materialMesh;
			scene.add( model );

			// Voxels
			updateVoxel();

			// Octree
			IterateOctree(octree, parameters.octreeLOD);

			UpdateRootGeometryVoxel();
			UpdateRootGeometryOctree();

			updateDisplay();

			console.log("cubes.length : " + voxels.length);
	    }

	} );
});

function ResetRootGeometryVoxel()
{
	rootGeometryVoxel.dispose();
	rootGeometryVoxel = new THREE.Geometry();
	scene.remove( rootMeshVoxel );	
}

function UpdateRootGeometryVoxel()
{
	rootGeometryVoxel.computeFaceNormals();
	rootMeshVoxel = new THREE.Mesh( rootGeometryVoxel, materialVoxel );
	rootMeshVoxel.matrixAutoUpdate = false;
	rootMeshVoxel.updateMatrix();
	scene.add( rootMeshVoxel );	
}

function ResetRootGeometryOctree()
{
	rootGeometryOctree.dispose();
	rootGeometryOctree = new THREE.Geometry();
	scene.remove( rootMeshOctree );	
}

function UpdateRootGeometryOctree()
{
	rootGeometryOctree.computeFaceNormals();
	rootMeshOctree = new THREE.Mesh( rootGeometryOctree, materialOctree );
	rootMeshOctree.matrixAutoUpdate = false;
	rootMeshOctree.updateMatrix();
	scene.add( rootMeshOctree );	
}

function AddCubeVoxel(position, dimension) {
	var cube = new THREE.Mesh( geometryCube, materialVoxel );
	cube.position.set(position.x, position.y, position.z);
	cube.scale.set(dimension.x, dimension.y, dimension.z);
	cube.updateMatrix();
	rootGeometryVoxel.merge(cube.geometry, cube.matrix);
	return cube;
}
function AddCubeOctree(position, dimension) {
	var cube = new THREE.Mesh( geometryCube, materialVoxel );
	cube.position.set(position.x, position.y, position.z);
	cube.scale.set(dimension.x, dimension.y, dimension.z);
	cube.updateMatrix();
	rootGeometryOctree.merge(cube.geometry, cube.matrix);
	return cube;
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