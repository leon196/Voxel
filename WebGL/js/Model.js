
Engine.Model = function(filePath)
{
	this.mesh;
    this.scale;
	this.size;
	this.sizeHalf;
    this.bounds;

	this.Init = function()
	{
		// Compute geometry
		this.mesh.geometry.computeBoundingBox();
		this.bounds = this.mesh.geometry.boundingBox;
        
		// Scale
		this.scale = Engine.Parameters.modelScale;
		this.mesh.scale.set(this.scale, this.scale, this.scale);
        
		// Size
		this.size = new Engine.Vector3(
			Math.ceil((this.bounds.max.x - this.bounds.min.x) * this.scale), 
			Math.ceil((this.bounds.max.y - this.bounds.min.y) * this.scale), 
			Math.ceil((this.bounds.max.z - this.bounds.min.z) * this.scale));

		// Size Half
		this.sizeHalf = new Engine.Vector3(
			Math.floor(this.size.x / 2), 
			Math.floor(this.size.y / 2), 
			Math.floor(this.size.z / 2));

		// Add to scene
		Engine.scene.add(this.mesh);
	}

	// Load mesh
	if (filePath != undefined) {
		Engine.LoadMesh(filePath, this);
	}
}