GameObject = function () 
{
	this.scale = 8;

	this.voxels = [];
	this.mesh;
	this.particleSystem;
	
	this.rotation = new THREE.Vector3();
	this.position = new THREE.Vector3();

	this.areaNear = 10;
	this.areaFar = 200;

	this.freeze = false;

	this.moveTo = function (position)
	{
		this.position.set(Math.floor(position.x), Math.floor(position.y), Math.floor(position.z));
		if (this.particleSystem != undefined) {
			this.particleSystem.position = this.position;
		}	
	};

	this.rotateTo = function (rotation) 
	{
		this.rotation.set(rotation.x, rotation.y, rotation.z)
	};

	this.nearestVoxelFrom = function (position)
	{
		var min = 100000, dist = 0, nearest = 0;
		for (var i = 0; i < this.voxels.length; i++) {
			dist = distance(position, this.voxels[i]);
			if (min > dist) {
				min = dist;
				nearest = i;
			}
		}
		return nearest;
	}

	this.initWithMesh = function (mesh) 
	{
		// Setup voxels
		this.mesh = mesh;
		this.voxels = getVoxelsFromMesh(this.mesh.geometry.vertices, this.mesh.geometry.faces, this.scale);
		this.cleanVoxels();
		// Setup particles
		this.particleSystem = initParticleSystem(this.voxels, this.scale);
	};

	this.cleanVoxels = function ()
	{
		for (var i = 0; i < this.voxels.length; ++i) {
			var voxel = this.voxels[i];
			for (var j = i+1; j < this.voxels.length; ++j) {
				var vox = this.voxels[j];
				if (Math.floor(voxel.x) == Math.floor(vox.x) && Math.floor(voxel.y) == Math.floor(vox.y) && Math.floor(voxel.z) == Math.floor(vox.z))
					this.voxels.splice(j, 1);
			}
		}
	};

	this.updateScaleFromPosition = function (position)
	{
		var dist = Math.max(0.01, (this.areaFar - distance(this.position, position)));
		var areaRatio = Math.max(0.01, Math.min(dist / (this.areaFar - this.areaNear), 1));
		return areaRatio * this.scale;
	};

	this.updateParticleSystem = function (position)
	{
		if (!this.freeze && this.particleSystem != undefined) {

			var scale = this.updateScaleFromPosition(position);

			var positions = this.particleSystem.geometry.attributes.position.array;
			var colors = this.particleSystem.geometry.attributes.color.array;

			var iV = 0;
			var color = new THREE.Color();
			for ( var i = 0; i < positions.length; i += 3 ) {

				var v = this.voxels[iV];
				++iV;

				var p = new THREE.Vector3(v.x, v.y, v.z);

				p.applyAxisAngle(new THREE.Vector3(1, 0, 0), this.rotation.x);
				p.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.y);
				p.applyAxisAngle(new THREE.Vector3(0, 0, 1), this.rotation.z);

				positions[ i ]     = Math.floor(p.x * scale);
				positions[ i + 1 ] = Math.floor(p.y * scale);
				positions[ i + 2 ] = Math.floor(p.z * scale);

				// colors from normal voxel
				var light = (v.n.x + v.n.y + v.n.z) * 0.333;
				color.setRGB(light , light, light);

				colors[ i ]     = color.r;
				colors[ i + 1 ] = color.g;
				colors[ i + 2 ] = color.b;
			}


			positions.needsUpdate = true;
			this.particleSystem.geometry.buffersNeedUpdate=true;
			this.particleSystem.geometry.verticesNeedUpdate=true;
			this.particleSystem.geometry.attributes.position.needsUpdate = true;
		}
	};

	this.getIndexFromPosition = function (position) {
		return Math.floor((position.x
						 + position.y * this.gridSize
						 + position.z * this.gridSize * this.gridSize) / this.scale);
	};

	this.isVoxelHere = function (position, aproximation)
	{
		var result = [];
		var vX, vY, vZ, pX, pY, pZ;
		for (var i = 0; i < this.voxels.length; i++) {
			vX = Math.floor(this.voxels[i].x * this.scale * aproximation);
			vY = Math.floor(this.voxels[i].y * this.scale * aproximation);
			vZ = Math.floor(this.voxels[i].z * this.scale * aproximation);
			pX = Math.floor(position.x * aproximation);
			pY = Math.floor(position.y * aproximation);
			pZ = Math.floor(position.z * aproximation);

			if (vX == pX && vY == pY && vZ == pZ) {
				result.push(i);
			}
		}
		return result;
	};

	this.eraseVoxels = function (indexes)
	{
		this.freeze = true;
		for (var i = 0; i < indexes.length; i++) {
			var index = indexes[i];
			if (index - i >= 0 && index - i < this.voxels.length) {
				this.voxels.splice(index - i, 1);
			}
		}
		this.particleSystem.geometry.attributes.position.array = new Float32Array(this.voxels.length * 3);
		this.particleSystem.geometry.attributes.position.array.needsUpdate = true;
		this.particleSystem.geometry.attributes.position.needsUpdate = true;
		this.particleSystem.geometry.attributes.color.array = new Float32Array(this.voxels.length * 3);
		this.particleSystem.geometry.attributes.color.array.needsUpdate = true;
		this.particleSystem.geometry.attributes.color.needsUpdate = true;
		this.particleSystem.geometry.buffersNeedUpdate=true;
		this.freeze = false;
		this.updateParticleSystem(this.scale);
	};

}