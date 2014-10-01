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
camera.position.z = 5;

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
var groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
var groundMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0xffffff, specular: 0x050505 } );
groundMat.color.setHSL( 0.095, 1, 0.75 );
var ground = new THREE.Mesh( groundGeo, groundMat );
ground.rotation.x = -Math.PI/2;
ground.position.y = -40;
// scene.add( ground );
// ground.receiveShadow = true;

// Setup Assets
var materialBasic = new THREE.MeshBasicMaterial( { color: 0x6600FF, wireframe: true } );
var materialBasicRed = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xffdddd, specular: 0xff0066, shininess: 10, shading: THREE.FlatShading } );
var geometryCube = new THREE.BoxGeometry(1,1,1);

// Load Mesh
var loader = new THREE.OBJLoader();
loader.load( 'models/mesh.obj', function ( object ) {
	/*
	object.traverse( function ( child ) {
		if ( child instanceof THREE.Mesh ) {

			// Init Mesh
			child.material = materialBasic;
			scene.add( child );

			parseVoxel(child.geometry, 1);
			if ( child.geometry !== undefined ) {

		        console.log( child.geometry.vertices );

		    }
		}

	});*/
	object.traverse( function ( child ) {

	    if ( child.geometry !== undefined ) {

	        child.geometry.computeBoundingBox();
	        var bounds = child.geometry.boundingBox;
	        var vertices = child.geometry.vertices.clone();
	        var faces = child.geometry.faces.clone();

	        var scale = 24;

	        child.scale.set(scale, scale, scale);

			child.material = materialBasic;
			// scene.add( child );

			var voxels = [];
			parseVoxel(voxels, vertices, faces, bounds, scale);

	    }

	} );
});

// AddCube({x,y,z})
function AddCube(position, color) {
	var mat = new THREE.MeshBasicMaterial( { color: color } );
	var cube = new THREE.Mesh( geometryCube, mat );
	cube.position.set(position.x, position.y, position.z);
	cube.castShadow = true;
	cube.material.color = color;
	// cube.receiveShadow = true;
	scene.add( cube );
}

// Render
function render() {
	requestAnimationFrame(render);

	var timer = 0.0005 * Date.now();

	camera.position.x = Math.cos( timer * 0.3 ) * 60;
	camera.position.z = Math.sin( timer * 0.3 ) * 60;

	dirLight.position.x = Math.cos( -timer ) * 600;
	dirLight.position.z = Math.sin( -timer ) * 600;

	camera.lookAt( scene.position );

	renderer.render(scene, camera);
}
render();