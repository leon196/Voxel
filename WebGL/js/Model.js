
Engine.Model = function(filePath)
{
	this.mesh;
	this.meshSize;
	this.meshSizeHalf;

	this.init = function()
	{
		// Scale
		var scale = Engine.Parameters.modelScale;
		this.mesh.scale.set(scale, scale, scale);

		// Compute geometry
		this.mesh.geometry.computeBoundingBox();
		var bounds = this.mesh.geometry.boudingBox;

		// Size
		this.meshSize = new Engine.Vector3(
			Math.ceil((bounds.max.x - bounds.min.x) * scale), 
			Math.ceil((bounds.max.y - bounds.min.y) * scale), 
			Math.ceil((bounds.max.z - bounds.min.z) * scale));

		// Size Half
		this.meshSizeHalf = new Engine.Vector3(
			Math.floor(meshSize.x / 2), 
			Math.floor(meshSize.y / 2), 
			Math.floor(meshSize.z / 2));

		// Add to scene
		scene.add(this.mesh);
	}

	// Callback function for OBJLoader
	this.onLoaded = function(object) {
		object.traverse( function (child) {
	    	if ( child instanceof THREE.Mesh ) {
	    		this.mesh = child;
	    		this.init();
	    	}
	    });
	}

	// Load mesh
	if (filePath != undefined) {
		Engine.LoadMesh(filePath, this.onLoaded);
	}
}