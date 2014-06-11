
// Elements
var camera, textureCamera, scene, renderer, vertexShader, fragmentShader;
var geometry, material, cube, planeScreen;
var controls, clock;
var finalRenderTarget;

//var automata = new Automata(dimension * dimension);
var colorWire = 0xcccccc;

function init()
{
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 75, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;

	clock = new THREE.Clock();

	scene = new THREE.Scene();

	finalRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { format: THREE.RGBAFormat, alpha: true } );
	renderer = new THREE.WebGLRenderer({ antialias:true, alpha: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	document.addEventListener( 'mousedown', mousedown, false );
	document.addEventListener( 'mouseup', mouseup, false );

	vertexShader = document.getElementById( 'vertexShader' ).textContent;
	fragmentShader = document.getElementById( 'fragmentShader' ).textContent;

	geometry = new THREE.BoxGeometry(11,11,11);

	
	var uniforms = { texture: { type: "t", value: finalRenderTarget  } };
	material = new THREE.ShaderMaterial( { uniforms: {}, attributes: {}, vertexShader: vertexShader, fragmentShader: fragmentShader, transparent: true } );
	material.transparent = true;
	
	//material = new THREE.MeshBasicMaterial( { map: finalRenderTarget } );
	cube = new THREE.Mesh( geometry, material );

	scene.add(cube);
	//CreateCubeWired(new THREE.Vector3(0,0,0));

	var planeGeometry = new THREE.PlaneGeometry(ASPECT * 10, 10);
	//var planeMaterial = new THREE.MeshBasicMaterial( { map: finalRenderTarget } );
	vertexShader = document.getElementById( 'vertexRender' ).textContent;
	fragmentShader = document.getElementById( 'fragmentRender' ).textContent;
	var planeMaterial = new THREE.ShaderMaterial( { uniforms: uniforms, attributes: {}, vertexShader: vertexShader, fragmentShader: fragmentShader, antialias:false } );
	planeMaterial.transparent = true;
	planeScreen = new THREE.Mesh( planeGeometry, planeMaterial );
	//planeScreen.position.y = -11;
	planeScreen.position.z = -1.0;
	//planeScreen.rotation.y = 3.14 * -0.5;
	
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	scene.add(camera);

	textureCamera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	textureCamera.position.z = 300;
	textureCamera.lookAt(new THREE.Vector3(0,0,0));

	controls = new THREE.FirstPersonControls(camera);
	controls.movementSpeed = 60;
	controls.lookSpeed = 0.125;
	controls.lookVertical = true;
	controls.mouseDragOn = false;
	controls.freeze = true;

	camera.position = new THREE.Vector3(-100, 0, 0);
	camera.lookAt(new THREE.Vector3(0,0,0));

	//planeScreen.position.x = 10.0;
	camera.add(planeScreen);
	camera.add(textureCamera);
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

	planeScreen.visible = false;

	renderer.render( scene, textureCamera, finalRenderTarget, true );
	controls.update(clock.getDelta());


	planeScreen.visible = true;
	//planeScreen.rotation.y = Math.cos(clock.getElapsedTime()) * 3.14 * 2.0;

	renderer.render(scene, camera);
}

function CreateCubeWired(position)
{
	// setup shader uniforms
	var uniforms = { time: { type: 'f', value: clock.getElapsedTime() } };
	// setup shader attributes
	var attributes = { center: { type: 'v3', boundTo: 'faceVertices', value: [] }  };
	// setup face barycentre (for easy wireframe)
	var centerValues = attributes.center.value;
	for( var f = 0; f < geometry.faces.length; f ++ ) {
		centerValues[ f ] = [ new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 1 ) ];
		geometry.faceVertexUvs[0][f].push(new THREE.Vector2(0,0));
		geometry.faceVertexUvs[0][f].push(new THREE.Vector2(0,1));
		geometry.faceVertexUvs[0][f].push(new THREE.Vector2(1,0));
	}
	geometry.uvNeedUpdate = true;
	// setup material
	var mat = new THREE.ShaderMaterial( { uniforms: {}, attributes: {}, vertexShader: vertexShader, fragmentShader: fragmentShader } );
	// setup mesh
	var cube = new THREE.Mesh( geometry, mat );
	// place the cube in scene
	cube.position = position;
	scene.add(cube);
	return cube
}

init();
render();