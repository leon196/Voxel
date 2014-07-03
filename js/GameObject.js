GameObject = function () 
{
	this.scale = 4;
	this.voxels = [];
	this.mesh;
	this.particleSystem;

	this.initWithMesh = function (meshName) 
	{
		var gameObject = this;

		// Load Mesh
		var loader = new THREE.OBJLoader();
		loader.load( meshName, function ( object ) {
			object.traverse( function ( child ) {
				// Find mesh in object
				if ( child instanceof THREE.Mesh ) {
					// Setup voxels
					gameObject.mesh = child;
					gameObject.voxels = getVoxelsFromMesh(gameObject.mesh.geometry.vertices, gameObject.mesh.geometry.faces, gameObject.scale);
					// Setup particles
					gameObject.particleSystem = initParticleSystem(gameObject.voxels, gameObject.scale);
				}
			});
		});
	};

	this.updateParticleSystem = function (scale)
	{
		if (this.particleSystem != undefined) {
			var positions = this.particleSystem.geometry.attributes.position.array;
			var colors = this.particleSystem.geometry.attributes.color.array;

			var iV = 0;
			var color = new THREE.Color();
			var n = 100, n2 = n / 2; // particles spread in the cube
			for ( var i = 0; i < positions.length; i += 3 ) {

				var p = this.voxels[iV];
				++iV;

				positions[ i ]     = Math.floor(p.x * scale);
				positions[ i + 1 ] = Math.floor(p.y * scale);
				positions[ i + 2 ] = Math.floor(p.z * scale);

				positions.needsUpdate = true;

				// colors
				color.setRGB( p.n.x, p.n.y, p.n.z );

				colors[ i ]     = color.r;
				colors[ i + 1 ] = color.g;
				colors[ i + 2 ] = color.b;

			}

			this.particleSystem.geometry.buffersNeedUpdate=true;
			this.particleSystem.geometry.verticesNeedUpdate=true;
			this.particleSystem.geometry.attributes.position.needsUpdate = true;
		}
	};

}