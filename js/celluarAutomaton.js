

function getNeighborCount(index)
{
	var count = 0;
	var position = getGridPosition(index);
	var neighbors = [
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y, position.z)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y, position.z)),
		getIndexPosition(new THREE.Vector3(position.x, position.y - voxelSize, position.z)),
		getIndexPosition(new THREE.Vector3(position.x, position.y + voxelSize, position.z)),
		getIndexPosition(new THREE.Vector3(position.x, position.y, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x, position.y, position.z + voxelSize)),

		getIndexPosition(new THREE.Vector3(position.x, position.y - voxelSize, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x, position.y - voxelSize, position.z + voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x, position.y + voxelSize, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x, position.y + voxelSize, position.z + voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y, position.z + voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y - voxelSize, position.z)),
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y + voxelSize, position.z)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y, position.z + voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y - voxelSize, position.z)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y + voxelSize, position.z)),
/*
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y - voxelSize, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y - voxelSize, position.z + voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y + voxelSize, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y - voxelSize, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x - voxelSize, position.y + voxelSize, position.z + voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y + voxelSize, position.z - voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y - voxelSize, position.z + voxelSize)),
		getIndexPosition(new THREE.Vector3(position.x + voxelSize, position.y + voxelSize, position.z + voxelSize))
*/
	];
	for (var n = neighbors.length; n >= 0; n--) {
		if (neighbors[n] >= 0 && neighbors[n] < gridSize*gridSize*gridSize) {
			count += voxels[neighbors[n]].status;
		}
	}
	return count;
}

function iterateGameOfLife()
{
	var count = gridSize * gridSize * gridSize;
	for (var i = 0; i < count; i++) {
		var neighborCount = getNeighborCount(i);

		// Dead
		if (voxelsBuffer[i] == 0) {
			// Birth
			if (neighborCount == 2) {
				voxels[i].status = 1;
				if (voxels[i].mesh == null) {
					var mesh = new THREE.Mesh( geometry, material );
					mesh.position = getGridPosition(i);
					scene.add(mesh);
					voxels[i].mesh = mesh;
				} else {
					voxels[i].mesh.visible = true;
				}
			}
		}
		// Alive
		else {
			// Death
			if (neighborCount != 2 && neighborCount != 3) {
				voxels[i].status = 0;
				if (voxels[i].mesh != null) {
					voxels[i].mesh.visible = false;
				}
			}
		}
	}

	for (var i = 0; i < count; i++) {
		voxelsBuffer[i] = voxels[i].status;
	}
}

/*
// Cellular Automaton
var dimension = 8;

function Automata(cellCount) {
	this.cells = [];
	for (var i = 0; i < cellCount; i++) {
		this.cells.push(new Cell(i, (Math.random() > 0.5 ? true : false)));
	}
}

Automata.prototype.cellAt = function(index) {
	return this.cells[index];
}

Automata.prototype.cellIsAlive = function (index) {
	return this.cellAt(index).alive;
}

function Cell(index, visible) {
	this.index = index;
	var position = getPosition(index);
	this.object = createCube(position);
	this.object.visible = visible;
	this.alive = visible;
}

Cell.prototype.neighborCount = function () {
	var top = checkCell(this.index - dimension);
	var bottom = checkCell(this.index + dimension);
	var left = checkCell(this.index - 1);
	var right = checkCell(this.index + 1);
	return top + bottom + left + right;
}

Cell.prototype.spawn = function() {
	this.object.visible = true;
	this.alive = true;
}

Cell.prototype.live = function() {
	this.object.visible = true;
	this.alive = true;
}

Cell.prototype.die = function() {
	this.object.visible = false;
	this.alive = false;
}

function checkAutomata() {
	for (var i = 0; i < dimension * dimension; i++) {
		var cell = automata.cellAt(i);
		var neighborCount = cell.neighborCount();
		switch (neighborCount) {
			default :
			case 0 : 
				cell.die(); 
				break;
			case 1 :
				cell.spawn();
				break;
			case 2 : 
			case 3 :
				cell.live(); 
				break;
		}
	}
}

function checkCell(index) {
	return (index >= 0 ? (index < dimension * dimension ? (automata.cellIsAlive(index) ? 1 : 0 ) : 0) : 0);
	alert(index);
}

function getPosition(index) {
	return new THREE.Vector3(index % dimension, Math.floor(index / dimension), 0.0);
}
*/