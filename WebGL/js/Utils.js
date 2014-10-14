// Create Engine Object
var Engine = {};

// Simple Vector3 object
Engine.Vector3 = function(x, y, z)
{
	if (x == undefined || y == undefined || z == undefined) {
		return { x: 0, y: 0, z: 0 };
	}
	return { x: x, y: y, z: z };
}

Engine.MaxRange = 64;
Engine.MaxBounds = new Engine.Vector3(Engine.MaxRange, Engine.MaxRange, Engine.MaxRange);
Engine.MaxLength = Engine.MaxRange * Engine.MaxRange * Engine.MaxRange;

// For elapsed time
Engine.Clock = new THREE.Clock();
Engine.Clock.start();

// For calculate delta time
Engine.elpasedTimeLastFrame = Date.now();

// For raycast operations
Engine.Raycaster;
Engine.Projector = new THREE.Projector();

// Find the closest power of 2
Engine.ClosestPowerOfTwo = function(number) {
    var n = number;
    n+=(n==0);
    n--;
    n|=n>>1;
    n|=n>>2;
    n|=n>>4;
    n|=n>>8;
    n|=n>>16;
    n++;
    return n;
}

// Add clone to array
Array.prototype.clone = function() { return this.slice(0); };

// Used to calculate length of vector from center of box to corner of box
var sqrt3 = Math.sqrt(3);

//
function distanceBetween(a, b) { return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y)+(a.z-b.z)*(a.z-b.z)); }

// Thank to Tomas Akenine-Möller
// For sharing his Triangle Box Overlaping algorithm
// http://fileadmin.cs.lth.se/cs/Personal/Tomas_Akenine-Moller/code/tribox3.txt

function planeBoxOverlap(normal, vert, maxbox)
{
	var vmin = new THREE.Vector3(0,0,0);
	var vmax = new THREE.Vector3(0,0,0);
	if(normal.x > 0) { vmin.x = -maxbox.x - vert.x; vmax.x = maxbox.x - vert.x;	}
	else { vmin.x = maxbox.x - vert.x; vmax.x = -maxbox.x - vert.x; }
	if(normal.y > 0) { vmin.y = -maxbox.y - vert.y; vmax.y = maxbox.y - vert.y;	}
	else { vmin.y = maxbox.y - vert.y; vmax.y = -maxbox.y - vert.y; }
	if(normal.z > 0) { vmin.z = -maxbox.z - vert.z; vmax.z = maxbox.z - vert.z;	}
	else { vmin.z = maxbox.z - vert.z; vmax.z = -maxbox.z - vert.z; }
	var min = new THREE.Vector3(normal.x, normal.y, normal.z);
	var max = new THREE.Vector3(normal.x, normal.y, normal.z);
	if (min.dot(vmin) > 0) return 0;	
	if (max.dot(vmax) >= 0) return 1;	
	return 0;
}

function triBoxOverlap(boxcenter, boxhalfsize, triangle)
{
	var v0 = {x:0, y:0, z:0};
	var v1 = {x:0, y:0, z:0};
	var v2 = {x:0, y:0, z:0};
	var min, max, p0, p1, p2, rad, fex, fey, fez;
	var normal = new THREE.Vector3(0,0,0);
	var e0 = new THREE.Vector3(0,0,0);
	var e1 = new THREE.Vector3(0,0,0);
	var e2 = new THREE.Vector3(0,0,0);

	/* This is the fastest branch on Sun */
	/* move everything so that the boxcenter is in (0,0,0) */
	v0.x = triangle.a.x - boxcenter.x; v0.y = triangle.a.y - boxcenter.y; v0.z = triangle.a.z - boxcenter.z;
	v1.x = triangle.b.x - boxcenter.x; v1.y = triangle.b.y - boxcenter.y; v1.z = triangle.b.z - boxcenter.z;
	v2.x = triangle.c.x - boxcenter.x; v2.y = triangle.c.y - boxcenter.y; v2.z = triangle.c.z - boxcenter.z;
	/* compute triangle edges */
	e0.x = v1.x - v0.x; e0.y = v1.y - v0.y; e0.z = v1.z - v0.z;
	e1.x = v2.x - v1.x; e1.y = v2.y - v1.y; e1.z = v2.z - v1.z;
	e2.x = v0.x - v2.x; e2.y = v0.y - v2.y; e2.z = v0.z - v2.z;

	/* Bullet 3:  */
	/*  test the 9 tests first (this was faster) */
	fex = Math.abs(e0.x);
	fey = Math.abs(e0.y);
	fez = Math.abs(e0.z);
	//
	p0 = e0.z * v0.y - e0.y * v0.z;
	p2 = e0.z * v2.y - e0.y * v2.z;
	if (p0 < p2) { min = p0; max = p2; } else { min = p2; max = p0; }  
	rad = fez * boxhalfsize.y + fey * boxhalfsize.z;
	if (min > rad || max < -rad) return 0;
	//
	p0 = -e0.z * v0.x + e0.x * v0.z;
	p2 = -e0.z * v2.x + e0.x * v2.z;	
    if(p0 < p2) { min = p0; max = p2; } else { min = p2; max = p0; }
	rad = fez * boxhalfsize.x + fex * boxhalfsize.z;
	if (min > rad || max < -rad) return 0;
	//
	p1 = e0.y * v1.x - e0.x * v1.y;
	p2 = e0.y * v2.x - e0.x * v2.y;
    if (p2 < p1) { min = p2; max = p1; } else { min = p1; max = p2; }
	rad = fey * boxhalfsize.x + fex * boxhalfsize.y;
	if (min > rad || max < -rad) return 0;
	//
	fex = Math.abs(e1.x);
	fey = Math.abs(e1.y);
	fez = Math.abs(e1.z);
	//
	p0 = e1.z * v0.y - e1.y * v0.z;
	p2 = e1.z * v2.y - e1.y * v2.z;
	if (p0 < p2) { min = p0; max = p2; } else { min = p2; max = p0; }  
	rad = fez * boxhalfsize.y + fey * boxhalfsize.z;
	if (min > rad || max < -rad) return 0;
	//
	p0 = -e1.z * v0.x + e1.x * v0.z;
	p2 = -e1.z * v2.x + e1.x * v2.z;
    if (p0 < p2) { min = p0; max = p2; } else { min = p2; max = p0; }
	rad = fez * boxhalfsize.x + fex * boxhalfsize.z;
	if (min > rad || max < -rad) return 0;
	//	
	p0 = e1.y * v0.x - e1.x * v0.y;
	p1 = e1.y * v1.x - e1.x * v1.y;
	if (p0 < p1) { min = p0; max = p1; } else { min = p1; max = p0; }
	rad = fey * boxhalfsize.x + fex * boxhalfsize.y;
	if (min > rad || max < -rad) return 0;
	//
	fex = Math.abs(e2.x);
	fey = Math.abs(e2.y);
	fez = Math.abs(e2.z);
	//
	p0 = e2.z * v0.y - e2.y * v0.z;
	p1 = e2.z * v1.y - e2.y * v1.z;
    if (p0 < p1) { min = p0; max = p1; } else { min = p1; max = p0; }
	rad = fez * boxhalfsize.y + fey * boxhalfsize.z;
	if (min > rad || max < -rad) return 0;
	//
	p0 = -e2.z * v0.x + e2.x * v0.z;
	p1 = -e2.z * v1.x + e2.x * v1.z;
	if (p0 < p1) { min = p0; max = p1; } else { min = p1; max = p0; }
	rad = fez * boxhalfsize.x + fex * boxhalfsize.z;
	if (min > rad || max < -rad) return 0;
	//
	p1 = e2.y * v1.x - e2.x * v1.y;
	p2 = e2.y * v2.x - e2.x * v2.y;
	if (p2 < p1) { min = p2; max = p1; } else { min = p1; max = p2;}
	rad = fey * boxhalfsize.x + fex * boxhalfsize.y;
	if (min > rad || max < -rad) return 0;

	/* Bullet 1: */
	/*  first test overlap in the {x,y,z}-directions */
	/*  find min, max of the triangle each direction, and test for overlap in */
	/*  that direction -- this is equivalent to testing a minimal AABB around */
	/*  the triangle against the AABB */
	/* test in X-direction */
	min = Math.min(v0.x, Math.min(v1.x, v2.x));
	max = Math.max(v0.x, Math.max(v1.x, v2.x));
	if (min > boxhalfsize.x || max < -boxhalfsize.x) return 0;
	/* test in Y-direction */
	min = Math.min(v0.y, Math.min(v1.y, v2.y));
	max = Math.max(v0.y, Math.max(v1.y, v2.y));
	if (min > boxhalfsize.y || max < -boxhalfsize.y) return 0;
	/* test in Z-direction */
	min = Math.min(v0.z, Math.min(v1.z, v2.z));
	max = Math.max(v0.z, Math.max(v1.z, v2.z));
	if (min > boxhalfsize.z || max < -boxhalfsize.z) return 0;
	/* Bullet 2: */
	/*  test if the box intersects the plane of the triangle */
	/*  compute plane equation of triangle: normal*x+d=0 */
	normal.crossVectors(e0, e1);
	if ( 0 == planeBoxOverlap(normal, v0, boxhalfsize)) return 0;	
	return 1;   /* box and triangle overlaps */
}