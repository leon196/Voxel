
// Elements
var camera, scene, renderer, vertexShader, fragmentShader;
var geometry, material, cube;
var controls, clock;

//var automata = new Automata(dimension * dimension);
var colorWire = 0xcccccc;

function init()
{
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 20;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	vertexShader = document.getElementById( 'vertexShader' ).textContent;
	fragmentShader = document.getElementById( 'fragmentShader' ).textContent;

	geometry = new THREE.BoxGeometry(11,11,11);
	material = new THREE.ShaderMaterial( { uniforms: {}, attributes: {}, vertexShader: vertexShader, fragmentShader: fragmentShader } );
	cube = new THREE.Mesh( geometry, material );

	scene.add(cube);

	controls = new THREE.FirstPersonControls(camera);
	controls.movementSpeed = 10;
	controls.lookSpeed = 0.125;
	controls.lookVertical = true;

	clock = new THREE.Clock();
}

function render()
{
	requestAnimationFrame(render);

	/*if (mouseDown) {
		camera.rotation.y += mouseDeltaPosition.x * 0.001;
		camera.rotation.x += mouseDeltaPosition.y * 0.001;
	}
*/
	controls.update(clock.getDelta());
	renderer.render(scene, camera);
}

function CreateCubeWired(position)
{
	// setup shader uniforms
	var uniforms = { time: { type: 'f', value: timeElapsed }  };
	// setup shader attributes
	var attributes = { center: { type: 'v3', boundTo: 'faceVertices', value: [] }  };
	var values = attributes.center.value;
	for( var f = 0; f < geometry.faces.length; f ++ ) {
		values[ f ] = [ new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 1 ) ];
	}
	// setup material
	var mat = new THREE.ShaderMaterial( { uniforms: uniforms, attributes: attributes, vertexShader: vertexShader, fragmentShader: fragmentShader } );
	// setup mesh
	var cube = new THREE.Mesh( geometry, mat );
	// place the cube in scene
	cube.position = position;
	objects.push(cube);
	return cube
}

init();
render();