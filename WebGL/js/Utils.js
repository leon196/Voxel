
// Simple Vector3 object
Engine.Vector3 = function(x, y, z)
{
	if (x != undefined && y != undefined && z != undefined) {
		return { x: 0, y: 0, z: 0 };
	}
	return { x: x, y: y, z: z };
}

// Load Mesh
Engine.OBJLoader = new THREE.OBJLoader();
Engine.LoadMesh = function(filepath, onLoaded)
{
	Engine.OBJLoader.load( filepath, onLoaded );
}