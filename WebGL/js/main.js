Array.prototype.clone = function() { return this.slice(0); };

// Setup Three
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Setup View
camera.position.z = 5;

// Setup Assets
var materialBasic = new THREE.MeshBasicMaterial( { color: 0x6600FF, wireframe: true, wireframeLinewidth: 1 } );
var materialBasicRed = new THREE.MeshBasicMaterial( { color: 0xFF0066, wireframe: true, wireframeLinewidth: 1 } );
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

	        var scale = 16;

	        child.scale.set(scale, scale, scale);

			child.material = materialBasic;
			scene.add( child );

			var voxels = [];

			// child.geometry.computeBoundingBox();
			parseVoxel(voxels, vertices, faces, bounds, scale);

	    }

	} );
});

// AddCube({x,y,z})
function AddCube(position) {
	var cube = new THREE.Mesh( geometryCube, materialBasicRed );
	cube.position.set(position.x, position.y, position.z);
	scene.add( cube );
}

// Render
function render() {
	requestAnimationFrame(render);

	var timer = 0.0005 * Date.now();

	camera.position.x = Math.cos( timer ) * 40;
	camera.position.z = Math.sin( timer ) * 40;

	camera.lookAt( scene.position );

	renderer.render(scene, camera);
}
render();