
// Elements
var camera, scene, renderer, vertexShader, fragmentShader;
var geometry, material, cube;
var controls, clock;

//var automata = new Automata(dimension * dimension);
var colorWire = 0xcccccc;

function init()
{

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	document.addEventListener( 'mousedown', mousedown, false );
	document.addEventListener( 'mouseup', mouseup, false );

	vertexShader = document.getElementById( 'vertexShader' ).textContent;
	fragmentShader = document.getElementById( 'fragmentShader' ).textContent;

	geometry = new THREE.BoxGeometry(11,11,11);
	material = new THREE.ShaderMaterial( { uniforms: {}, attributes: {}, vertexShader: vertexShader, fragmentShader: fragmentShader } );
	cube = new THREE.Mesh( geometry, material );

	scene.add(cube);
	
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 75, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	camera.position.z = 20;
	scene.add(camera);

	textureCamera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	textureCamera.position.z = 20;
	scene.add(textureCamera);

	controls = new THREE.FirstPersonControls(camera);
	controls.movementSpeed = 60;
	controls.lookSpeed = 0.125;
	controls.lookVertical = true;
	controls.mouseDragOn = false;

	camera.position = new THREE.Vector3(-100, 0, 0);

	clock = new THREE.Clock();
}

function mousedown(event)
{
	mouseDown = true;
	//controls.freeze = false;
}

function mouseup(event)
{
	mouseDown = false;
	//controls.freeze = true;
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