
function drawLine (p0, p1, normal)
{
	var points = [];
	var p = {x:p0.x, y:p0.y, z:p0.z, n: normal};
	var d = {x:p1.x-p0.x, y:p1.y-p0.y, z:p1.z-p0.z};
	var N = Math.max(Math.max(Math.abs(d.x), Math.abs(d.y)), Math.abs(d.z));
	var s = {x:d.x/N, y:d.y/N, z:d.z/N};
	points.push(p);
	for (var i = 1; i < N; i++) {
		p = { 	x: p.x + s.x,
				y: p.y + s.y,
				z: p.z + s.z,
				n: normal }; // normal from triangle
		points.push(p);
	}
	return points;
}	

function getVoxelsFromMesh(vertices, faces, scale) {
	var voxels = [];
	var cb = new THREE.Vector3();
	var ab = new THREE.Vector3();
	for (var f = 0; f < faces.length; f++) {
		var face = faces[f];
		var pA = {
			x:vertices[face.a].x * scale,
			y:vertices[face.a].y * scale,
			z:vertices[face.a].z * scale};
		var pB = {
			x:vertices[face.b].x * scale,
			y:vertices[face.b].y * scale,
			z:vertices[face.b].z * scale};
		var pC = {
			x:vertices[face.c].x * scale,
			y:vertices[face.c].y * scale,
			z:vertices[face.c].z * scale};

		// Distance from A to C
		var dAC = Math.floor(Math.sqrt((pC.x-pA.x)*(pC.x-pA.x)+(pC.y-pA.y)*(pC.y-pA.y)+(pC.z-pA.z)*(pC.z-pA.z)));

		// Normal
		cb.subVectors( pC, pB );
		ab.subVectors( pA, pB );
		cb.cross( ab );
		cb.normalize();

		for (var i = 0; i < dAC; i++) {
			var delta = i/dAC;
			var p0 = {
				x:pA.x * (1 - delta) + delta * pC.x,
				y:pA.y * (1 - delta) + delta * pC.y,
				z:pA.z * (1 - delta) + delta * pC.z};
			var p1 = {
				x:pB.x * (1 - delta) + delta * pC.x,
				y:pB.y * (1 - delta) + delta * pC.y,
				z:pB.z * (1 - delta) + delta * pC.z};
			var line = drawLine(p0, p1, {x:cb.x, y:cb.y, z:cb.z});
			voxels.push.apply(voxels, line);
		}
	}
	return voxels;
}


function getGridPosition(index, lod)
{
	var gSize = GRID_SIZE / Math.pow(2, lod);
	var vSize = VOxEL_SIZE * Math.pow(2, lod);
	return new THREE.Vector3 (
			vSize * ((index % gSize)),
			vSize * ((Math.floor(index / gSize) % gSize)),
			vSize * ((Math.floor(index / (gSize*gSize)) % gSize)));
}

function getIndexPosition (position)
{
	return Math.floor((position.x
					 + position.y * GRID_SIZE
					 + position.z * GRID_SIZE * GRID_SIZE) / VOXEL_SIZE);
}

function dotProduct(p1, p2) {
	return p1.x * p2.x + p1.y * p2.y + p1.z * p2.z;
}

function plane(x, z, p0, n) {
	var d = -n.x * p0.x - n.y * p0.y - n.z * p0.z;
	return  (- n.x*x - n.z*z - d) / (n.y);
}