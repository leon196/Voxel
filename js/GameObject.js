GameObject = function () 
{
	this.scale = 1;
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

			var iV = 0;
			for ( var i = 0; i < positions.length; i += 3 ) {

				var p = this.voxels[iV];
				++iV;

				positions[ i ]     = Math.floor(p.x * scale);
				positions[ i + 1 ] = Math.floor(p.y * scale);
				positions[ i + 2 ] = Math.floor(p.z * scale);

				positions.needsUpdate = true;

			}

			this.particleSystem.geometry.buffersNeedUpdate=true;
			this.particleSystem.geometry.verticesNeedUpdate=true;
			this.particleSystem.geometry.attributes.position.needsUpdate = true;
		}
	};

}