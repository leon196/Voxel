
// Voxel Object
Engine.Voxel = function (voxelIndex_, voxelPosition_, voxelNormal_) 
{
    this.index = voxelIndex_;
    this.x = voxelPosition_.x;
    this.y = voxelPosition_.y;
    this.z = voxelPosition_.z;
    this.normal = voxelNormal_;
};

Engine.VoxelizeMesh = function(mesh_)
{
	// Lists of vertices and triangles
	var vertices = mesh_.vertices.clone();
	var triangles = mesh_.triangles.clone();
	var trianglesCount = triangles.length;
	
	// Sizes
	var meshSize = new Engine.Vector3(
		(bounds.max.x - bounds.min.x) * param.meshScale, 
		(bounds.max.y - bounds.min.y) * param.meshScale, 
		(bounds.max.z - bounds.min.z) * param.meshScale);
	var meshHalfSize = new Engine.Vector3(
		Math.floor(meshSize.x / 2), 
		Math.floor(meshSize.y / 2), 
		Math.floor(meshSize.z / 2));
	var min = new Engine.Vector3();
	var max = new Engine.Vector3();

	// Array list representing the 3D grid
	var gridBuffer = new Array(Math.ceil(meshSize.x * meshSize.y * meshSize.z));

	// For each triangles
	for (var t = 0; t < trianglesCount; t++) {

		// Triangle's vertices position
		var face3 = triangles[t];
		var a = vertices[face3.a].clone().multiplyScalar(param.meshScale).add(meshHalfSize);
		var b = vertices[face3.b].clone().multiplyScalar(param.meshScale).add(meshHalfSize);
		var c = vertices[face3.c].clone().multiplyScalar(param.meshScale).add(meshHalfSize);
		
		// Triangle
		var triangle = new Engine.Triangle(a, b, c);

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
				if (0 != triBoxOverlap(boxCenter, {x:0.5, y:0.5, z:0.5}, triangle))
				{
					// Voxel position
					var pos = new THREE.Vector3(
						min.x + x - meshHalfSize.x, 
						min.y + y - meshHalfSize.y, 
						min.z + z - meshHalfSize.z);

					// Create mesh cube
					var cube = AddCubeVoxel(pos, {x:1, y:1, z:1}, 0);

					// Define the position (no duplicate)
					gridBuffer[gridIndex] = new Voxel(gridIndex, pos, triangle.normal, cube);

					// Create voxel
					voxels.push(new Voxel(gridIndex, pos, triangle.normal, cube));

					// Octree insertion
					octree.insert(pos);
				}
			}
		}
	}
	// Fill Surfaces
	var current = -1;
	var columns = [];
	// The first slice of the grid
	var sliceCount = (meshSize.x * meshSize.z);
	for (var s = 0; s < sliceCount; ++s) {
		var positionX = s % meshSize.x;
		var positionZ = Math.floor(s / meshSize.x) % meshSize.z;
		current = -1;
		columns = [];
		// For each colum of the voxel picked from slice
		for (var c = 0; c < meshSize.y; ++c) {
			var indexVoxel = Math.floor(s + c * meshSize.x * meshSize.z);
			// var pos = {x:positionX - meshHalfSize.x, y:c - meshHalfSize.y, z:positionZ - meshHalfSize.z};
			// var cube = AddCubeVoxel(pos, {x:1,y:1,z:1}, 0);
			// 		octree.insert(pos);
			var voxel = gridBuffer[indexVoxel];
			// If voxel
			if (voxel != undefined) {
				// Grab it
				columns.push(voxel);
			}
		}
		if (columns.length > 1) {
			for (var c = 0; c < columns.length; ++c) {
				var voxel = columns[c];
				// if (voxel.normal.y <= 0) {
				// 	current = voxel.index;
				// } else if (voxel.normal.y > 0) {
					if (current != -1) {
						var currentVoxel = voxels[current];
						if (currentVoxel != undefined) {
							// console.log("voxel.y : " + voxel.y);
							for (var positionY = currentVoxel.y + 1; positionY < voxel.y; ++positionY) {
								// console.log("positionY : " + positionY);
								// Add Voxel Cube
								var pos = { 
									x: positionX - meshHalfSize.x, 
									y: positionY, 
									z: positionZ - meshHalfSize.z };
								var cube = AddCubeVoxel(pos, {x:1,y:1,z:1}, 0);
								// cube.renderer.material.color = Color.black;
								
								// Voxel taken
								var indexVoxelColumn = Math.floor(s + positionY * meshSize.x * meshSize.z);
								gridBuffer[indexVoxelColumn] = new Voxel(indexVoxelColumn, {x:positionX, y:positionY, z:positionZ}, {x:0, y:0, z:0	}, cube);

								// Add to octree
								// octree.insert(pos);
							}
						}
						//current = -1;
					} else {
						current = voxel.index;
					}
				// }
			}
		}
	}

	// return gridBuffer;
}