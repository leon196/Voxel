// Voxel Element
Engine.Voxel = function (voxelIndex_, voxelPosition_, voxelNormal_) 
{
    this.index = voxelIndex_;
    this.x = voxelPosition_.x;
    this.y = voxelPosition_.y;
    this.z = voxelPosition_.z;
    this.normal = voxelNormal_;
};

// Voxel Manager
Engine.VoxelManager = function()
{
    this.voxels;
    this.meshVoxel;
    this.geometryVoxel;
    
    this.Init = function()
    {
        this.voxels = [];  
        this.geometryVoxel = new THREE.Geometry();
        this.meshVoxel = new THREE.Mesh(this.geometryVoxel, Engine.Materials.voxelMultiMaterials);
    };
    
    this.UpdateWithModel = function(model_)
    {
        // Clean Geometry
        this.geometryVoxel.dispose();
        this.geometryVoxel = new THREE.Geometry();
        Engine.scene.remove( this.meshVoxel );
        
        // Voxelize
        this.VoxelizeModel(model_);
        
        // Update Geometry
        this.geometryVoxel.computeFaceNormals();
        this.meshVoxel = new THREE.Mesh( this.geometryVoxel, Engine.Materials.normal);
        this.meshVoxel.matrixAutoUpdate = false;
        this.meshVoxel.updateMatrix();
        Engine.scene.add( this.meshVoxel );	
    };
    
    this.AddVoxel = function(position, materialIndex)
    {
        var cube = new THREE.Mesh( Engine.BoxGeometry );
        cube.position.set(position.x, position.y, position.z);
        cube.updateMatrix();
        this.geometryVoxel.merge(cube.geometry, cube.matrix, materialIndex);
    };

    // Parse Voxel
    this.VoxelizeModel = function(model)
    {
        // Lists of vertices and triangles
        var vertices = model.mesh.geometry.vertices.clone();
        var triangles = model.mesh.geometry.faces.clone();
        var trianglesCount = triangles.length;

        // Array list representing the 3D grid
        var gridBuffer = new Array(Math.ceil(model.size.x * model.size.y * model.size.z));

        // For each triangles
        for (var t = 0; t < trianglesCount; t++) {

            // Triangle's vertices position
            var face3 = triangles[t];
            var a = vertices[face3.a].clone().multiplyScalar(Engine.Parameters.modelScale).add(model.sizeHalf);
            var b = vertices[face3.b].clone().multiplyScalar(Engine.Parameters.modelScale).add(model.sizeHalf);
            var c = vertices[face3.c].clone().multiplyScalar(Engine.Parameters.modelScale).add(model.sizeHalf);

            // Triangle
            var triangle = new Engine.Triangle(a, b, c);

            // For each voxel in bounds
            var gridCount = (triangle.size.x * triangle.size.y * triangle.size.z);
            for (var v = 0; v < gridCount; ++v)
            {
                // Position in grid
                var x = v % triangle.size.x;
                var y = Math.floor( v / (triangle.size.x * triangle.size.z )) % triangle.size.y;
                var z = Math.floor( v / triangle.size.x ) % triangle.size.z;

                // 
                var voxelBounds = { min: new THREE.Vector3(0, 0, 0), max: new THREE.Vector3(0, 0, 0) };
                voxelBounds.min.x = triangle.min.x + x;
                voxelBounds.min.y = triangle.min.y + y;
                voxelBounds.min.z = triangle.min.z + z;
                voxelBounds.max.x = triangle.min.x + x + 1;
                voxelBounds.max.y = triangle.min.y + y + 1;
                voxelBounds.max.z = triangle.min.z + z + 1;

                // Unique ID by position
                var gridIndex = Math.floor(triangle.min.x + x + (triangle.min.z + z) * model.size.x + (triangle.min.y + y) * (model.size.x * model.size.z));
                var gridBufferUnit = gridBuffer[gridIndex];
                if (gridBufferUnit == undefined)
                {
                    // Intersection test
                    var voxelBoundsCenter = { x:voxelBounds.min.x + 0.5, y:voxelBounds.min.y + 0.5, z:voxelBounds.min.z + 0.5 };
                    var voxelBoundsDimension = { x:0.5, y:0.5, z:0.5 };
                    if (0 != triBoxOverlap(voxelBoundsCenter, voxelBoundsDimension, triangle))
                    {
                        // Voxel position
                        var pos = new THREE.Vector3(
                            voxelBounds.min.x - model.sizeHalf.x + 0.5, 
                            voxelBounds.min.y - model.sizeHalf.y + 0.5, 
                            voxelBounds.min.z - model.sizeHalf.z + 0.5);

                        // Create mesh cube
                        var cube = this.AddVoxel(pos, 0);

                        // Define the position (no duplicate)
                        gridBuffer[gridIndex] = new Engine.Voxel(gridIndex, pos, triangle.normal);

                        // Create voxel
    //					voxels.push(new Voxel(gridIndex, pos, triangle.normal));

                        // Octree insertion
    //					octree.insert(pos);
                    }
                }
            }
        }
        /*
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

        // return gridBuffer;*/
    };
    
};