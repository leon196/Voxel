var geometryBuffer, materialParticle;
var particleSystem;

function initParticleSystem(vertices, scale)
{
	var particles = vertices.length;

	geometryBuffer = new THREE.BufferGeometry();
	geometryBuffer.addAttribute( 'position', new THREE.Float32Attribute( particles * 3, 3 ));
	geometryBuffer.addAttribute( 'color', new THREE.Float32Attribute( particles * 3, 3 ));

	var positions = geometryBuffer.getAttribute( 'position' ).array;
	var colors = geometryBuffer.getAttribute( 'color' ).array;

	var color = new THREE.Color();

	var n = 100, n2 = n / 2; // particles spread in the cube

	var iV = 0;
	for ( var i = 0; i < positions.length && iV < vertices.length; i += 3 ) {

		// positions
		var p = vertices[iV];
		iV++;

		positions[ i ]     = p.x;
		positions[ i + 1 ] = p.y;
		positions[ i + 2 ] = p.z;

		// colors

		var vx = ( p.x / n ) + 0.5;
		var vy = ( p.y / n ) + 0.5;
		var vz = ( p.z / n ) + 0.5;

		color.setRGB( vx, vy, vz );

		colors[ i ]     = color.r;
		colors[ i + 1 ] = color.g;
		colors[ i + 2 ] = color.b;

	}

	geometryBuffer.computeBoundingSphere();

	// Material
	materialParticle = new THREE.ParticleSystemMaterial( { size: scale, vertexColors: true } );
	// Particle System
	particleSystem = new THREE.ParticleSystem( geometryBuffer, materialParticle );
	// 
	scene.add( particleSystem );

}

function updateParticleSystem(vertices)
{

	var particles = vertices.length;

	var positions = particleSystem.geometry.attributes.position.array;
	//var colors = particleSystem.geometry.getAttribute( 'color' ).array;

	//var color = new THREE.Color();

	var n = 10, n2 = n / 2; // particles spread in the cube
	var iV = 0;
	for ( var i = 0; i < positions.length && iV < vertices.length; i += 3 ) {

		// positions
		var p = vertices[iV];
		iV++;

		positions[ i ]     = p.x;
		positions[ i + 1 ] = p.y;
		positions[ i + 2 ] = p.z;

		positions.needsUpdate = true;

		// colors

		//var vx = ( p.x / n ) + 0.5;
		//var vy = ( p.y / n ) + 0.5;
		//var vz = ( p.z / n ) + 0.5;

		//color.setRGB( vx, vy, vz );

		//colors[ i ]     = color.r;
		//colors[ i + 1 ] = color.g;
		//colors[ i + 2 ] = color.b;

	}

	particleSystem.geometry.verticesNeedUpdate=true;
	particleSystem.geometry.attributes.position.needsUpdate = true;
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