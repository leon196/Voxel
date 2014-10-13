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
    this.grids;
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
    
    this.GetGridFromPosition = function(position_)
    {  
        var oct = 0;
		if(position_.x >= 0) oct |= 4;
		if(position_.y >= 0) oct |= 2;
		if(position_.z >= 0) oct |= 1;
		return oct;
    };
    
    this.GridPosition = function(position_)
    {
        var position = position_.clone();
        
        return position.sub({x:0.5, y:0.5, z:0.5}).round();
    };
    
    this.GetIndexFromPosition = function(position)
    {   
        // Get grid index from position
        return Math.round(
            Math.abs(position.x)
            + Math.abs(position.z) * Engine.MaxBounds.x
            + Math.abs(position.y) * (Engine.MaxBounds.x * Engine.MaxBounds.z));
    };
    
    this.SubVoxelAt = function(position_)
    {
        var position = position_.clone().sub({x:0.5, y:0.5, z:0.5}).round();
        var index = this.GetIndexFromPosition(position);
        var gridIndex = this.GetGridFromPosition(position);
        
        if (gridIndex < Engine.MaxLength)
        {
            var voxel = this.grids[gridIndex][index];

            if (voxel != undefined)
            {
                this.voxels[this.voxels.indexOf(this.grids[gridIndex][index])] = undefined;
                this.grids[gridIndex][index] = undefined;

                this.UpdateVoxels();
            }
        }
    };
    
    // 
    this.AddVoxelAt = function(position_)
    {   
        var position = position_.clone().sub({x:0.5, y:0.5, z:0.5}).round();
        var index = this.GetIndexFromPosition(position);        
        var gridIndex = this.GetGridFromPosition(position);
        
        if (gridIndex < Engine.MaxLength)
        {
            var voxel = this.grids[gridIndex][index];

            if (voxel == undefined)
            {
                voxel = new Engine.Voxel(index, position, {x:0, y:0, z:0});
                this.voxels.push(voxel);
                this.grids[gridIndex][index] = voxel;

                this.UpdateVoxels();
            }
        } else {
            console.log("voxel out of domain");   
        }
    };
    
    // Dynamic Construction Process
    this.BuildVoxels = function()
    {
        for (var v = 0; v < this.voxels.length; ++v) {
            var voxel = this.voxels[v];
            if (voxel != undefined) {
                this.AddVoxel(voxel.position, voxel.materialIndex);
            }
        }
        
        /* TEST INDEX POSITION (Not optimal, use for debug) */
        
//        var size = Engine.MaxBounds;
//        for (var g = 0; g < 8; ++g) {
//            var grid = this.grids[g];
//            for (var v = 0; v < grid.length; ++v) {
//                var voxel = grid[v];
//                if (voxel != undefined) {
//                    var pos = {
//                        x: v % size.x, 
//                        y:Math.floor(v/(size.x*size.z))%size.y, 
//                        z: Math.floor(v/size.x)%size.z};
//                    //
//                    if (g < 4) { pos.x *= -1; }
//                    if (g < 2 || g == 4 || g == 5) { pos.y *= -1; }
//                    if (g % 2 == 0) { pos.z *= -1; }
//                    this.AddVoxel(pos, 0);
//                }
//            }
//        }
    };
    
    this.UpdateVoxels = function()
    {
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
    };
    
    // Update current model
    this.UpdateModel = function()
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
        this.BuildVoxels();
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
    
    // Add geometry
    this.AddVoxel = function(position, materialIndex)
    {
        var cube = new THREE.Mesh( Engine.BoxGeometry );
        cube.position.set(
            position.x + 0.5,
            position.y + 0.5,
            position.z + 0.5);
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
        this.grids = [];
        
        // Lists of vertices and triangles
        var vertices = model.mesh.geometry.vertices.clone();
        var triangles = model.mesh.geometry.faces.clone();
        var trianglesCount = triangles.length;
        
        // Model origin
        var modelPosition = Engine.modelManager.GetModel().mesh.position;

        // Array list representing the 3D grid
//        this.grid = new Array(Math.ceil(model.size.x * model.size.y * model.size.z));
        
        //
        for (var g = 0; g < 8; ++g) {
            var grid = new Array(Math.ceil(Engine.MaxBounds.x * Engine.MaxBounds.y * Engine.MaxBounds.z));
            this.grids.push(grid);
        }

        // For each triangles
        for (var t = 0; t < trianglesCount; t++) {

            // Triangle's vertices position
            var face3 = triangles[t];
            var a = vertices[face3.a].clone().multiplyScalar(Engine.Parameters.modelScale);//.add(model.sizeHalf);
            var b = vertices[face3.b].clone().multiplyScalar(Engine.Parameters.modelScale);//.add(model.sizeHalf);
            var c = vertices[face3.c].clone().multiplyScalar(Engine.Parameters.modelScale);//.add(model.sizeHalf);

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
                var voxelIndex = Math.floor(
                    Math.abs(gridPosition.x) % Engine.MaxBounds.x
                    + Math.abs(gridPosition.z) * Engine.MaxBounds.x
                    + Math.abs(gridPosition.y) * (Engine.MaxBounds.x * Engine.MaxBounds.z));
                /*if (gridIndex < 0) {
                    console.log(gridIndex);
                    console.log(gridPosition);
                }*/
                
                var gridIndex = this.GetGridFromPosition(gridPosition);
                
                var gridUnit = this.grids[gridIndex][voxelIndex];
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
                            gridPosition.x,
                            gridPosition.y,
                            gridPosition.z);

                        // Create mesh cube
//                        var cube = this.AddVoxel(pos, 0);

                        // Create voxel
                        var voxel = new Engine.Voxel(voxelIndex, pos, triangle.normal);

                        // Define the position (no duplicate)
                        this.grids[gridIndex][voxelIndex] = voxel;

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