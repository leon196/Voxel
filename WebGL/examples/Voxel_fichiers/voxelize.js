var buffer = [];

	/*
function drawLine(p0, p1) {
	//var dx = p1.x - p0.x;
	//var dy = p1.y - p0.y;

	var d = p1.sub(p0);
  	var D = p0.distanceTo(p1);
	var slope = d.y / d.x;  	

	makeCube(p0);
	var p = p0;

	for (var x = p0.x + 1; x < p1.x; x++) {
		if (D > 0) {
			p.y = p.y + 1;
			D += 2 * (d.y - d.x);
			//D = D + (2 * dy - 2 * dx);
		} else {
			//D = D + (2 * dy);
			D += 2 * d.y;
		}
		p.x = x;
		makeCube(p);
	}
}
*/

function visitAll(gx0, gy0, gz0, gx1, gy1, gz1, visitor, scale) {
	
	var gx0idx = Math.floor(gx0);
	var gy0idx = Math.floor(gy0);
	var gz0idx = Math.floor(gz0);
	
	var gx1idx = Math.floor(gx1);
	var gy1idx = Math.floor(gy1);
	var gz1idx = Math.floor(gz1);
    
    var sx = gx1idx > gx0idx ? 1 : gx1idx < gx0idx ? -1 : 0;
    var sy = gy1idx > gy0idx ? 1 : gy1idx < gy0idx ? -1 : 0;
    var sz = gz1idx > gz0idx ? 1 : gz1idx < gz0idx ? -1 : 0;
        
	var gx = gx0idx;
	var gy = gy0idx;
	var gz = gz0idx;
	
	//Planes for each axis that we will next cross
    var gxp = gx0idx + (gx1idx > gx0idx ? 1 : 0);
    var gyp = gy0idx + (gy1idx > gy0idx ? 1 : 0);
    var gzp = gz0idx + (gz1idx > gz0idx ? 1 : 0);
	
	//Only used for multiplying up the error margins
	var vx = gx1 === gx0 ? 1 : gx1 - gx0;
	var vy = gy1 === gy0 ? 1 : gy1 - gy0;
	var vz = gz1 === gz0 ? 1 : gz1 - gz0;
	
    //Error is normalized to vx * vy * vz so we only have to multiply up
    var vxvy = vx * vy;
    var vxvz = vx * vz;
    var vyvz = vy * vz;
	
	//Error from the next plane accumulators, scaled up by vx*vy*vz
	var errx = (gxp - gx0) * vyvz;
	var erry = (gyp - gy0) * vxvz;
	var errz = (gzp - gz0) * vxvy;
	
	var derrx = sx * vyvz;
	var derry = sy * vxvz;
	var derrz = sz * vxvy;
    
    var testEscape = 80;
    do {

    	if (-1 == buffer.indexOf(gx + "" + gy + "" + gz)) {
	        visitor(gx, gy, gz);
	        buffer.push(gx + "" + gy + "" + gz);
		}
			
			if (gx === gx1idx && gy === gy1idx && gz === gz1idx) break;

	        //Which plane do we cross first?
			var xr = Math.abs(errx);
			var yr = Math.abs(erry);
			var zr = Math.abs(errz);
			
			if (sx !== 0 && (sy === 0 || xr < yr) && (sz === 0 || xr < zr)) {
				gx += sx;
				errx += derrx;
			}
			else if (sy !== 0 && (sz === 0 || yr < zr)) {
				gy += sy;
				erry += derry;
			}
			else if (sz !== 0) {
				gz += sz;
				errz += derrz;
			}

//	} while (true);
	} while (testEscape-- > 0);
}
function makeVoxel(x, y, z) {
	//voxels.push()
}
function makeCube(p) {

	var geometry = new THREE.BoxGeometry(VOXEL_SIZE,VOXEL_SIZE,VOXEL_SIZE);
	var material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } ); 
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(p.x+0.5,p.y+0.5,p.z+0.5);
    mesh.matrixNeedsUpdate = true;
    scene.add(mesh);
    return mesh;
}
function testLine(l0,l1, scale) {
    visitAll(l0.x * scale, l0.y * scale, l0.z * scale, l1.x * scale, l1.y * scale, l1.z * scale, makeCube, scale);
}
function randomVector(length) {
    return new THREE.Vector3(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5).multiplyScalar(length);
}

function testRandom(length) {
    testLine(randomVector(length), randomVector(length), makeCube);
}

function voxelize(vertices, triangles, scale) {
	buffer = [];
	for (var i = 0; i < triangles.length; i++) {
		var pA = vertices[triangles[i].a];
		var pB = vertices[triangles[i].b];
		var pC = vertices[triangles[i].c];
		drawLine(new THREE.Vector3(Math.floor(pA.x * scale), Math.floor(pA.y * scale), Math.floor(pA.z * scale)),
			new THREE.Vector3(Math.floor(pB.x * scale), Math.floor(pB.y * scale), Math.floor(pB.z)),
			scale);
		drawLine(new THREE.Vector3(Math.floor(pB.x * scale), Math.floor(pB.y * scale), Math.floor(pB.z * scale)),
			new THREE.Vector3(Math.floor(pC.x * scale), Math.floor(pC.y * scale), Math.floor(pC.z)),
			scale);
		//testLine(vertices[tri.a], vertices[tri.b], scale);
		//testLine(vertices[tri.b], vertices[tri.c], scale);
	}
}