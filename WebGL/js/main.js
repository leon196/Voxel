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
// var textureBrick = THREE.ImageUtils.loadTexture( "textures/BrickOldRounded0134_2_S.jpg" );
// var textureIvy = THREE.ImageUtils.loadTexture( "textures/Ivy0021_5_S.jpg" );
// var textureWood = THREE.ImageUtils.loadTexture( "textures/WoodPlanksBare0171_7_S.jpg" );

// 
var materialMesh = new THREE.MeshPhongMaterial({ color: parameters.modelColor, ambient: 0x030303, specular: 0x660066, shininess: 10 });
var materialVoxel = new THREE.MeshBasicMaterial({ color: parameters.voxelColor, ambient: 0x030303, specular: 0x660066, shininess: 10 });
var materialColorNormal = new THREE.MeshNormalMaterial();
// var materialOctree = new THREE.MeshBasicMaterial({ color: parameters.octreeColor, wire: parameters.octreeWire });
var geometryCube = new THREE.BoxGeometry(1,1,1);
for (var i = 0; i < geometryCube.faces.length; ++i) { geometryCube.faces[i].materialIndex = 0; }


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
	new THREE.MeshBasicMaterial({
		color:parameters.octreeColor,
		wire: parameters.octreeWire
	}),
	new THREE.MeshBasicMaterial({
		color:0xff6600,
		wire: parameters.octreeWire
	})];

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