Triangle = function () 
{
	this.a = new THREE.Vector3(0,0,0);
	this.b = new THREE.Vector3(0,0,0);
	this.c = new THREE.Vector3(0,0,0);
	this.normal = new THREE.Vector3(0,0,0);
}

Voxel = function (voxelIndex_, voxelPosition_, voxelNormal_, voxelMesh_)
{
    this.index = voxelIndex_;
    this.x = voxelPosition_.x;
    this.y = voxelPosition_.y;
    this.z = voxelPosition_.z;
    this.normal = voxelNormal_;
    this.mesh = voxelMesh_;

    this.updateDisplay = function() {
    	this.mesh.visible = parameters.voxelVisible;
    	var color;
    	if (parameters.voxelColorNormal) { color = new THREE.Color((this.normal.x + 1) / 2, (this.normal.y + 1) / 2, (this.normal.z + 1) / 2); }
    	else { color = new THREE.Color(parameters.voxelColor); }
    	this.mesh.material.color = color;
    	this.mesh.material.wireframe = parameters.voxelWire;
    }
}

function parseVoxel(meshVertices, meshTriangles, meshSize_, scale_)
{
	var vertices = meshVertices.clone(); // [ new THREE.Vector3(), ... ]
	var triangles = meshTriangles.clone();	// [ new THREE.Face3(), ... ]
	var trianglesCount = triangles.length;
	// var bounds = meshBounds; // { min: new THREE.Vector3(), max: new THREE.Vector3() }
	var meshSize = meshSize_;//new THREE.Vector3((bounds.max.x - bounds.min.x) * scale_, (bounds.max.y - bounds.min.y) * scale_, (bounds.max.z - bounds.min.z) * scale_);
	var meshHalfSize = new THREE.Vector3(meshSize.x / 2, meshSize.y / 2, meshSize.z / 2);
	var min = new THREE.Vector3(0,0,0);
	var max = new THREE.Vector3(0,0,0);

	var gridBuffer = new Array(Math.ceil(meshSize.x * meshSize.y * meshSize.z));

	// console.log(meshHalfSize);

	// For each triangles
	for (var t = 0; t < trianglesCount; t++) {

		// Triangle
		var tri = new Triangle();
		var triangle = triangles[t];
		// console.log(vertices[triangle.a]);
		tri.a = vertices[triangle.a].clone();
		tri.a.multiplyScalar(scale_).add(meshHalfSize);
		tri.b = vertices[triangle.b].clone();
		tri.b.multiplyScalar(scale_).add(meshHalfSize);
		tri.c = vertices[triangle.c].clone();
		tri.c.multiplyScalar(scale_).add(meshHalfSize);

		// Normal
		var nAB = new THREE.Vector3(0,0,0);
		nAB.subVectors(tri.b, tri.a);
		var nAC = new THREE.Vector3(0,0,0);
		nAC.subVectors(tri.c, tri.a);
		tri.normal.crossVectors(nAB, nAC).normalize();
	    // tri.centroid = (tri.a + tri.b + tri.c) / 3;

		// Min & Max
		min.x = Math.floor(Math.min(tri.a.x, Math.min(tri.b.x, tri.c.x)));
		min.y = Math.floor(Math.min(tri.a.y, Math.min(tri.b.y, tri.c.y))); 
		min.z = Math.floor(Math.min(tri.a.z, Math.min(tri.b.z, tri.c.z)));
		max.x = Math.ceil(Math.max(tri.a.x, Math.max(tri.b.x, tri.c.x)));
		max.y = Math.ceil(Math.max(tri.a.y, Math.max(tri.b.y, tri.c.y)));
		max.z = Math.ceil(Math.max(tri.a.z, Math.max(tri.b.z, tri.c.z)));
		if (Math.abs(max.x - min.x) < 1) { max.x += 1; }
		else if (Math.abs(max.y - min.y) < 1) { max.y += 1; }
		else if (Math.abs(max.z - min.z) < 1) { max.z += 1; }

		// Bounds
		var size = new THREE.Vector3(0, 0, 0);
		size.x = Math.abs(max.x - min.x);
		size.y = Math.abs(max.y - min.y);
		size.z = Math.abs(max.z - min.z);
		center = min + new THREE.Vector3(Math.floor(size.x / 2), Math.floor(size.y / 2), Math.floor(size.z / 2));
		//Bounds triBounds = new Bounds(center, size);

		// For each voxel in bounds
		var gridCount = (size.x * size.y * size.z);
					// console.log(tri.a);
		for (var v = 0; v < gridCount; ++v) {

			// Position in grid
			var x = v % size.x;
			var y = Math.floor( v / (size.x * size.z )) % size.y;
			var z = Math.floor( v / size.x ) % size.z;

			// voxel bound
			var box = { min: new THREE.Vector3(0, 0, 0), max: new THREE.Vector3(0, 0, 0) };
			box.min.x = min.x + x;
			box.min.y = min.y + y;
			box.min.z = min.z + z;
			box.max.x = min.x + x + 1;
			box.max.y = min.y + y + 1;
			box.max.z = min.z + z + 1;

			// Unique ID by position
			var gridIndex = Math.floor(min.x + x + (min.z + z) * meshSize.x + (min.y + y) * (meshSize.x * meshSize.z));
			var gridBufferUnit = gridBuffer[gridIndex];
			if (gridBufferUnit == undefined)
			{
				var boxCenter = { x:box.min.x + 0.5, y:box.min.y + 0.5, z:box.min.z + 0.5 };
				// Intersection test
				if (0 != triBoxOverlap(boxCenter, {x:0.5, y:0.5, z:0.5}, tri))
				{
					// Voxel position
					var pos = new THREE.Vector3(min.x + x + 0.5 - meshHalfSize.x, min.y + y + 0.5 - meshHalfSize.y, min.z + z + 0.5 - meshHalfSize.z);

					// Create mesh cube
					var cube = AddCube(pos, {x:1, y:1, z:1}, new THREE.Color((tri.normal.x + 1) / 2, (tri.normal.y + 1) / 2, (tri.normal.z + 1) / 2));

					// Define the position (no duplicate)
					gridBuffer[gridIndex] = 1;

					// Create voxel
					voxels.push(new Voxel(gridIndex, box.min, tri.normal, cube));

					// Octree insertion
					octree.insert(pos);
				}
			}
		}
	}

	// return gridBuffer;
}