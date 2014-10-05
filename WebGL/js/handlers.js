///////////////////////////////////////////////////////////////////////////////////////////////
// Display Handlers 

function updateDisplay()
{
	// Model
	model.visible = parameters.modelVisible;
	// model.material.color = new THREE.Color(parameters.modelColor);
	model.material.wireframe = parameters.modelWire;
	// model.material.shading = parameters.modelSmooth ? THREE.SmoothShading : THREE.FlatShading;

	// Voxels
	// for (var v = 0; v < voxels.length; v++) { voxels[v].updateDisplay(); }
	rootMeshVoxel.visible = parameters.voxelVisible;
	rootMeshVoxel.material.color = new THREE.Color(parameters.voxelColor);
	rootMeshVoxel.material.wireframe = parameters.voxelWire;

	// Octree
	rootMeshOctree.visible = parameters.octreeVisible;
	rootMeshOctree.material.color = new THREE.Color(parameters.octreeColor);
	rootMeshOctree.material.wireframe = parameters.octreeWire;
}

function updateScale()
{
	model.scale.set(parameters.modelScale, parameters.modelScale, parameters.modelScale);

	if (parameters.voxelAutoUpdate) {
		reparseVoxels();
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////
// Voxel Handlers 

function updateVoxel()
{
    model.geometry.computeBoundingBox();
    var bounds = model.geometry.boundingBox;
    var vertices = model.geometry.vertices.clone();
    var faces = model.geometry.faces.clone();
	var meshSize = new THREE.Vector3(
		(bounds.max.x - bounds.min.x) * parameters.modelScale,
		(bounds.max.y - bounds.min.y) * parameters.modelScale,
		(bounds.max.z - bounds.min.z) * parameters.modelScale);
	var dimensionMax = Math.max(Math.ceil(meshSize.x/2), Math.max(Math.ceil(meshSize.y/2), Math.ceil(meshSize.z/2)));
	
	var n = dimensionMax;
	n+=(n==0);
	n--;
	n|=n>>1;
	n|=n>>2;
	n|=n>>4;
	n|=n>>8;
	n|=n>>16;
	n++;
	dimensionMax = n;
	
	// Octree
	octree = new Octree({x:0, y:0, z:0}, {x:dimensionMax, y:dimensionMax, z:dimensionMax});

	// Voxels
	parseVoxel(vertices, faces, meshSize, parameters.modelScale);
}

function reparseVoxels()
{
	ResetRootGeometryVoxel();
	updateVoxel();
	UpdateRootGeometryVoxel();
}

///////////////////////////////////////////////////////////////////////////////////////////////
// Octree Handlers 

function updateLOD()
{
	ResetRootGeometryOctree();
	IterateOctree(octree, parameters.octreeLOD);
	UpdateRootGeometryOctree();
}


function IterateOctree(octreeRoot, count) {
	var color = new THREE.Color(1,0,0);
	var dimension = {
		x: octreeRoot.halfDimension.x * 2,
		y: octreeRoot.halfDimension.y * 2,
		z: octreeRoot.halfDimension.z * 2};
	if (count == 0 || octreeRoot.halfDimension.x <= 0.5) {
		if (octreeRoot.hasChildren() || octreeRoot.data != undefined) {
			AddCubeOctree(octreeRoot.origin, dimension);
		}
	} else {
		// Octree Node has children
		if (octreeRoot.hasChildren()) {
			// Octree Node has 8 children with data in each
			if (octreeRoot.hasAllChildren()) {
				AddCubeOctree(octreeRoot.origin, dimension);
			}
			// Iterate each children
			else {
				for (var i = 0; i < 8; ++i) {
					var octreeChild = octreeRoot.children[i];
					var newDimension = {
						x: octreeChild.halfDimension.x * 2,
						y: octreeChild.halfDimension.y * 2,
						z: octreeChild.halfDimension.z * 2};
					// If we have reach level of details
					if (count == 0) {
						// If octree node has children or has data
						if (octreeChild.hasChildren() || octreeChild.data != undefined) {
							AddCubeOctree(octreeChild.origin, newDimension);
						}
					// Iterate more level of details
					} else {
						IterateOctree(octreeChild, count - 1);
					}
				}
			}
		}
		// Octree Node is a leaf and got data
		else if (octreeRoot.data != undefined) {

			//
			// var i = octreeRoot.getOctantContainingPoint(point);
			octreeRoot.split();
			for (var i = 0; i < 8; ++i) {
				var octreeChild = octreeRoot.children[i];
				IterateOctree(octreeChild, count - 1);
			}
		}
	}
}