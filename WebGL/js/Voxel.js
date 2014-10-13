// Voxel Element
Engine.Voxel = function (voxelIndex_, voxelPosition_, voxelNormal_) 
{
    this.index = voxelIndex_;
    this.position = voxelPosition_;
    this.normal = voxelNormal_;
    this.materialIndex = 0;
};

// Voxel Manager
Engine.VoxelManager = function()
{
    this.voxels;
    this.grid;
    this.meshVoxel;
    this.geometryVoxel;
    this.dimension;
    
    this.Init = function()
    {
        this.voxels = [];  
        this.geometryVoxel = new THREE.Geometry();
        this.meshVoxel = new THREE.Mesh(this.geometryVoxel, Engine.Materials.voxelMultiMaterials);
        this.dimension = new THREE.Vector3();
    };
    
    // 
    this.ClickVoxelAt = function(position)
    {     
        position.round();
        var size = Engine.modelManager.GetModel().size;
        var half = Engine.modelManager.GetModel().sizeHalf;
        var index = Math.floor(
            position.x + half.x
            + (position.z + half.z) * size.x
            + (position.y + half.y) * (size.x * size.z));
        
        //Math.ceil(model.size.x * model.size.y * model.size.z)
        
                Engine.helper.HitTest({
                    x: index % size.x - half.x - 0.5,
                    y: Math.floor(index / (size.x * size.z)) % size.y - half.y - 0.5,
                    z: Math.floor(index / size.x) % size.z - half.z - 0.5});
        
        console.log(index);
        
        var voxel = this.grid[index];
        if (voxel != undefined) {
            
            console.log(voxel);
            
            this.voxels.splice(voxel.index, 1);
            this.grid[index] = undefined;
            
            // Clean Geometry
            this.geometryVoxel.dispose();
            this.geometryVoxel = new THREE.Geometry();
            Engine.scene.remove( this.meshVoxel );

            // Voxelize
            this.BuildVoxels();
            Engine.Parameters.voxelCount = "" + this.voxels.length;

            // Update Geometry
            this.geometryVoxel.computeFaceNormals();
            this.meshVoxel = new THREE.Mesh( this.geometryVoxel, Engine.Materials.voxel);
            this.meshVoxel.matrixAutoUpdate = false;
            this.meshVoxel.updateMatrix();

            // Display
            this.UpdateDisplay();
            Engine.scene.add( this.meshVoxel );	
            
        }
        
    };
    
    // Shortcut
    this.Update = function()
    {
        this.UpdateWithModel(Engine.modelManager.GetModel());
    };
    
    // Voxel Construction Process
    this.UpdateWithModel = function(model_)
    {
        // Clean Geometry
        this.geometryVoxel.dispose();
        this.geometryVoxel = new THREE.Geometry();
        Engine.scene.remove( this.meshVoxel );
        
        // Voxelize
        this.VoxelizeModel(model_);
        Engine.Parameters.voxelCount = "" + this.voxels.length;
        
        // Update Geometry
        this.geometryVoxel.computeFaceNormals();
        this.geometryVoxel.computeBoundingBox();
        var bounds = this.geometryVoxel.boundingBox;
        this.dimension = (bounds.max).sub(bounds.min);
            
        this.meshVoxel = new THREE.Mesh( this.geometryVoxel, Engine.Materials.normal);
        this.meshVoxel.matrixAutoUpdate = false;
        this.meshVoxel.updateMatrix();
        
        // Display
        this.UpdateDisplay();
        Engine.scene.add( this.meshVoxel );	
    };
    
    // Dynamic Construction Process
    this.BuildVoxels = function()
    {
        for (var v = 0; v < this.voxels.length; ++v) {
            var voxel = this.voxels[v];
            this.AddVoxel(voxel.position, 0);
        }
//        for (var v = 0; v < this.grid.length; ++v) {
//            var voxel = this.grid[v];
//            if (voxel != undefined) {
//                this.AddVoxel(voxel.position, voxel.materialIndex);
//            }
//        }
    };
    
    // Add geometry
    this.AddVoxel = function(position, materialIndex)
    {
        var cube = new THREE.Mesh( Engine.BoxGeometry );
        cube.position.set(position.x, position.y, position.z);
        cube.updateMatrix();
        this.geometryVoxel.merge(cube.geometry, cube.matrix, materialIndex);
    };
    
    // Material
    this.UpdateDisplay = function()
    {
        // Visibility
        this.meshVoxel.visible = Engine.Parameters.voxelVisible;
        
        // Color Normal
        if (Engine.Parameters.voxelColorNormal) {
            this.meshVoxel.material = Engine.Materials.normal;
        } 
        // Color User
        else {
            this.meshVoxel.material = Engine.Materials.voxel;
            this.meshVoxel.material.color = new THREE.Color(Engine.Parameters.voxelColor);
        }
        
        // Wireframe
        this.meshVoxel.material.wireframe = Engine.Parameters.voxelWire;
    };

    // Parse Voxel
    this.VoxelizeModel = function(model)
    {
        // Reset voxels
        this.voxels = [];
        
        // Lists of vertices and triangles
        var vertices = model.mesh.geometry.vertices.clone();
        var triangles = model.mesh.geometry.faces.clone();
        var trianglesCount = triangles.length;

        // Array list representing the 3D grid
        this.grid = new Array(Math.ceil(model.size.x * model.size.y * model.size.z));

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
                // Position in triangle grid
                var x = v % triangle.size.x;
                var y = Math.floor( v / (triangle.size.x * triangle.size.z )) % triangle.size.y;
                var z = Math.floor( v / triangle.size.x ) % triangle.size.z;

                // 
                var gridPosition = new Engine.Vector3();
                gridPosition.x = triangle.min.x + x;
                gridPosition.y = triangle.min.y + y;
                gridPosition.z = triangle.min.z + z;

                // Unique ID by position
                var gridIndex = Math.floor(
                    gridPosition.x
                    + gridPosition.z * model.size.x
                    + gridPosition.y * (model.size.x * model.size.z));
                /*if (gridIndex < 0) {
                    console.log(gridIndex);
                    console.log(gridPosition);
                }*/
                var gridUnit = this.grid[gridIndex];
                if (gridUnit == undefined)
                {
                    // Intersection test
                    var voxelBoundsCenter = { 
                        x:gridPosition.x + 0.5, 
                        y:gridPosition.y + 0.5, 
                        z:gridPosition.z + 0.5 };
                    var voxelBoundsDimension = { x:0.5, y:0.5, z:0.5 };
                    if (0 != triBoxOverlap(voxelBoundsCenter, voxelBoundsDimension, triangle))
                    {
                        // Voxel position
                        var pos = new THREE.Vector3(
                            gridPosition.x - model.sizeHalf.x + 0.5, 
                            gridPosition.y - model.sizeHalf.y + 0.5, 
                            gridPosition.z - model.sizeHalf.z + 0.5);

                        // Create mesh cube
                        var cube = this.AddVoxel(pos, 0);

                        // Create voxel
                        var voxel = new Engine.Voxel(this.voxels.length, pos, triangle.normal);

                        // Define the position (no duplicate)
                        this.grid[gridIndex] = voxel;

                        // For optimizing iterations
    					this.voxels.push(voxel);
                    }
                }
            }
        }
    };
    
    this.Fill = function()
    {
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
                                
                                for (var positionY = currentVoxel.y + 1; positionY < voxel.y; ++positionY)
                                {
                                    // Add Voxel Cube
                                    var pos = { 
                                        x: positionX - meshHalfSize.x, 
                                        y: positionY, 
                                        z: positionZ - meshHalfSize.z };
                                    var cube = AddCubeVoxel(pos, {x:1,y:1,z:1}, 0);

                                    // Voxel taken
                                    var indexVoxelColumn = Math.floor(s + positionY * meshSize.x * meshSize.z);
                                    gridBuffer[indexVoxelColumn] = new Voxel(indexVoxelColumn, {x:positionX, y:positionY, z:positionZ}, {x:0, y:0, z:0	}, cube);
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
    };
    
};