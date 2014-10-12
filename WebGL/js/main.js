

// Load Mesh
var loader = new THREE.OBJLoader();
loader.load( 'models/cubeOriented.mesh', function ( object ) {

	object.traverse( function ( child ) {

	    if ( child.geometry !== undefined ) {

			// Voxels
			updateVoxel();

			// Octree
			if (parameters.exploreMode) {
				var bounds = model.geometry.boundingBox;
				anchorExploration = {
					x:(bounds.max.x - bounds.min.x) * parameters.modelScale,
					y:(bounds.max.y - bounds.min.y) * parameters.modelScale,
					z:(bounds.max.z - bounds.min.z) * parameters.modelScale};
				helperDistanceExploration.position.set(anchorExploration.x, anchorExploration.y, anchorExploration.z);
				ExploreOctree(octree, anchorExploration);
			} else {
				IterateOctree(octree, parameters.octreeLOD);
			}

			UpdateRootGeometryVoxel();

			updateLOD(camera.position);

			updateDisplay();

			updateHelper();

			console.log("cubes.length : " + voxels.length);


	    }

	} );
});
