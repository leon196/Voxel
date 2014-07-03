function initParticleSystem(vertices, scale)
{
	var particles = vertices.length;

	var geometryBuffer = new THREE.BufferGeometry();
	geometryBuffer.addAttribute( 'position', new THREE.Float32Attribute( particles, 3 ));
	geometryBuffer.addAttribute( 'color', new THREE.Float32Attribute( particles, 3 ));

	var positions = geometryBuffer.getAttribute( 'position' ).array;
	var colors = geometryBuffer.getAttribute( 'color' ).array;

	var color = new THREE.Color();

	var n = 100, n2 = n / 2; // particles spread in the cube
	var iV = 0;
	for ( var i = 0; i < particles * 3; i += 3 ) {

		// positions
		var p = vertices[iV];
		iV++;

		positions[ i ]     = p.x;
		positions[ i + 1 ] = p.y;
		positions[ i + 2 ] = p.z;

		// colors
		var light = (p.n.x + p.n.y + p.n.z) * 0.333;
		color.setRGB(light , light, light);

		colors[ i ]     = color.r;
		colors[ i + 1 ] = color.g;
		colors[ i + 2 ] = color.b;
	}

	geometryBuffer.computeBoundingSphere();

	// Material
	var materialParticle = new THREE.ParticleSystemMaterial( { size: scale, vertexColors: true } );

	// Particle System
	var particleSystem = new THREE.ParticleSystem( geometryBuffer, materialParticle );

	// 
	scene.add( particleSystem );

	return particleSystem;
}


function CreateCubeWired(position)
{

	// Shader Voxel
	vertexShader = document.getElementById( 'vertexShader' ).textContent;
	fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
	// Basic Voxel Shape
	var geometry = new THREE.BoxGeometry(VOXEL_SIZE,VOXEL_SIZE,VOXEL_SIZE);
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
	//var mat = new THREE.ShaderMaterial( { uniforms: {}, attributes: {}, vertexShader: vertexShader, fragmentShader: fragmentShader } );

	var material = new THREE.ShaderMaterial( { uniforms: {}, attributes: {}, vertexShader: vertexShader, fragmentShader: fragmentShader, transparent: true } );
	material.transparent = true;
	// setup mesh
	var cube = new THREE.Mesh( geometry, material );
	// place the cube in scene
	cube.position = position;
	scene.add(cube);
	return cube
}

// Mesh Mode
/*
function initParticleSystem(vertices, scale)
{
	var particles = vertices.length;

	var geometryBuffer = new THREE.BufferGeometry();
	geometryBuffer.addAttribute( 'index', new THREE.Uint32Attribute( particles * 4, 1 ));
	geometryBuffer.addAttribute( 'position', new THREE.Float32Attribute( particles * 4, 3 ));
	geometryBuffer.addAttribute( 'normal', new THREE.Float32Attribute( particles * 4, 3 ));
	geometryBuffer.addAttribute( 'color', new THREE.Float32Attribute( particles * 4, 3 ));

	var indices = geometryBuffer.getAttribute( 'index' ).array;
	var normals = geometryBuffer.getAttribute( 'normal' ).array;
	var positions = geometryBuffer.getAttribute( 'position' ).array;
	var colors = geometryBuffer.getAttribute( 'color' ).array;

	var color = new THREE.Color();
	var pA = new THREE.Vector3();
	var pB = new THREE.Vector3();
	var pC = new THREE.Vector3();
	var cb = new THREE.Vector3();
	var ab = new THREE.Vector3();

	var max = 0;
	for ( var i = 0; i < indices.length; i += 6 ) {
		indices[i] = i;
		indices[i + 1] = i + 1;
		indices[i + 2] = i + 2;
		indices[i + 3] = i + 2;
		indices[i + 4] = i + 3;
		indices[i + 5] = i;
	}

	var n = 100, n2 = n / 2; // particles spread in the cube
	var iV = 0;
	for ( var i = 0; i < particles * 12; i += 12 ) {

		// positions
		var p = vertices[iV];
		iV++;

		var ax = p.x;
		var ay = p.y;
		var az = p.z;

		var bx = p.x + 0.5;
		var by = p.y;
		var bz = p.z;

		var cx = p.x + 0.5;
		var cy = p.y + 0.5;
		var cz = p.z;

		var dx = p.x;
		var dy = p.y + 0.5;
		var dz = p.z;

		positions[ i ]     = ax;
		positions[ i + 1 ] = ay;
		positions[ i + 2 ] = az;

		positions[ i + 3 ] = bx;
		positions[ i + 4 ] = by;
		positions[ i + 5 ] = bz;

		positions[ i + 6 ] = cx;
		positions[ i + 7 ] = cy;
		positions[ i + 8 ] = cz;

		positions[ i + 9 ] = dx;
		positions[ i + 10 ] = dy;
		positions[ i + 11 ] = dz;

		// colors

		var vx = ( p.x / n ) + 0.5;
		var vy = ( p.y / n ) + 0.5;
		var vz = ( p.z / n ) + 0.5;

		color.setRGB( vx, vy, vz );

		colors[ i ]     = color.r;
		colors[ i + 1 ] = color.g;
		colors[ i + 2 ] = color.b;

		colors[ i + 3 ] = color.r;
		colors[ i + 4 ] = color.g;
		colors[ i + 5 ] = color.b;

		colors[ i + 6 ] = color.r;
		colors[ i + 7 ] = color.g;
		colors[ i + 8 ] = color.b;

		colors[ i + 9 ] = color.r;
		colors[ i + 10 ] = color.g;
		colors[ i + 11 ] = color.b;

		pA.set( ax, ay, az );
		pB.set( bx, by, bz );
		pC.set( cx, cy, cz );
		cb.subVectors( pC, pB );
		ab.subVectors( pA, pB );
		cb.cross( ab );

		cb.normalize();

		var nx = cb.x;
		var ny = cb.y;
		var nz = cb.z;

		normals[ i ]     = nx;
		normals[ i + 1 ] = ny;
		normals[ i + 2 ] = nz;

		normals[ i + 3 ] = nx;
		normals[ i + 4 ] = ny;
		normals[ i + 5 ] = nz;

		normals[ i + 6 ] = nx;
		normals[ i + 7 ] = ny;
		normals[ i + 8 ] = nz;

		normals[ i + 9 ] = nx;
		normals[ i + 10 ] = ny;
		normals[ i + 11 ] = nz;


	}

	geometryBuffer.computeBoundingSphere();

	// Material
	var materialParticle = new THREE.ParticleSystemMaterial( { size: scale, vertexColors: true } );
	var material = new THREE.MeshPhongMaterial( {
						color: 0xaaaaaa, ambient: 0xaaaaaa, specular: 0xffffff, shininess: 250, vertexColors: THREE.VertexColors
				} );
	// Particle System
	var particleSystem = new THREE.ParticleSystem( geometryBuffer, materialParticle );

	var mesh = new THREE.Mesh( geometryBuffer, material );
	// 
	scene.add( mesh );

	return mesh;
}
*/