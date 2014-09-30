// Setup Three
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Setup View
camera.position.z = 5;

// Setup Assets
var materialBasic = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var geometryCube = new THREE.BoxGeometry(1,1,1);

// Load Mesh
var loader = new THREE.OBJLoader();
loader.load( 'models/mesh.obj', function ( object ) {
	object.traverse( function ( child ) {
		if ( child instanceof THREE.Mesh ) {

			// Init Mesh
			child.material = materialBasic;
			scene.add( child );
		}
	});
});

// AddCube({x,y,z})
function AddCube(position) {
	var cube = new THREE.Mesh( geometryCube, materialBasic );
	cube.position.set(position.x, position.y, position.z);
	scene.add( cube );
}

// Render
function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
render();