// Setup Three
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Setup View
camera.position.z = 5;

// Setup Light
dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
dirLight.color.setHSL( 0.1, 1, 0.95 );
dirLight.position.set( -1, 1.75, 1 );
dirLight.position.multiplyScalar( 50 );
scene.add( dirLight );

// Setup Shaders
var vertexShader = document.getElementById( 'vertexShader' ).textContent;
var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
var shaderMaterial = new THREE.ShaderMaterial( { uniforms: {}, attributes: {}, vertexShader: vertexShader, fragmentShader: fragmentShader, antialias:false } );

// Load Mesh
var loader = new THREE.OBJLoader();
loader.load( 'models/mesh.obj', function ( object ) {
	object.traverse( function ( child ) {
		if ( child instanceof THREE.Mesh ) {

			// Init Mesh
			child.material = shaderMaterial;
			scene.add( child );

			// Parse Voxel
		}
	});
});

// AddCube({x,y,z})
function AddCube(position) {
	var materialBasic = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var geometryCube = new THREE.BoxGeometry(1,1,1);
	var cube = new THREE.Mesh( geometryCube, materialBasic );
	cube.position.set(position.x, position.y, position.z);
	scene.add(cube);
}

// Render
function render() {
	requestAnimationFrame(render);

	var timer = - Date.now() / 5000;

	camera.position.x = Math.cos( timer ) * 6;
	camera.position.z = Math.sin( timer ) * 6;
	camera.lookAt( scene.position );

	renderer.render(scene, camera);
}

render();