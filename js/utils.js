
function drawLine (p0, p1)
{
	var points = [];
	var p = p0;
	//Math.sqrt((p1.x-p0.x)*(p1.x-p0.x)+(p1.y-p0.y)*(p1.y-p0.y)+(p1.z-p0.z)*(p1.z-p0.z));
	var d = {x:p1.x-p0.x, y:p1.y-p0.y, z:p1.z-p0.z};
	//var N = {x:Math.abs(d.x), y:Math.abs(d.y), z:Math.abs(d.z)};
	//var d = Math.sqrt((p1.x-p0.x)*(p1.x-p0.x)+(p1.y-p0.y)*(p1.y-p0.y)+(p1.z-p0.z)*(p1.z-p0.z));
	var N = Math.max(Math.max(Math.abs(d.x), Math.abs(d.y)), Math.abs(d.z));
	var s = {x:d.x/N, y:d.y/N, z:d.z/N};
	points.push(p);
	for (var i = 1; i < N; i++) {
		p = {x:p.x+s.x, y:p.y+s.y, z:p.z+s.z};
		points.push(p);
	}
	return points;
}	
function drawline3 () {
	var points = [];

    var x0 = p0.x >> 0;
    var y0 = p0.y >> 0;
    var z0 = p0.z >> 0;
    var x1 = p1.x >> 0;
    var y1 = p1.y >> 0;
    var z1 = p1.z >> 0;
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var dz = Math.abs(z1 - z0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var sz = (z0 < z1) ? 1 : -1;
    var err = dx - dy;
    while(true) {
        points.push({x:x0, y:y0, z:z0});
        if((x0 == x1) && (y0 == y1)) break;
        var e2 = 2 * err;
        if(e2 > -dy) { err -= dy; x0 += sx; }
        if(e2 < dx) { err += dx; y0 += sy; }

    }
    return points;
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

function getVoxelsFromMesh(vertices, faces, scale) {
	var voxels = [];
	for (var f = 0; f < faces.length; f++) {
		var face = faces[f];
		var pA = vertices[face.a];
		var pB = vertices[face.b];
		var pC = vertices[face.c];
		//var ab = {x:(pA.x + pB.x) / 2, y:(pA.y + pB.x) / 2, z:(pA.z + pB.z) / 2};
		var dAB = Math.floor(Math.sqrt((pB.x-pA.x)*(pB.x-pA.x)+(pB.y-pA.y)*(pB.y-pA.y)+(pB.z-pA.z)*(pB.z-pA.z)));
		for (var i = 0; i < dAB; i++) {
			var delta = i/dAB;
			var p0 = {x:pA.x * (1 - delta) + delta * pC.x,
				y:pA.y * (1 - delta) + delta * pC.y,
				z:pA.z * (1 - delta) + delta * pC.z};
			var p1 = {x:pB.x * (1 - delta) + delta * pC.x,
				y:pB.y * (1 - delta) + delta * pC.y,
				z:pB.z * (1 - delta) + delta * pC.z};
			var line = drawLine(p0, p1);
			voxels.push.apply(voxels, line);
		}
		/*
		var points = DrawTriangle(vertices[face.a], vertices[face.b], vertices[face.c]);
		console.log(points);
		for (var p = 0; p < points.length; p++) {
			var x = points[p].x;
			var z = points[p].y;
			var y = Math.floor(plane(x, z, vertices[face.a], face.normal));
			voxels.push({x:x, y:y, z:z});
		}
	*/
	}
	return voxels;
}

function getPointsFromTriangle(triangle) {
	var points = [];

	var order = [0, 1, 2];
	var p0, p1, p2;
	var total = 0;
	// find the lowest y
	if (triangle[0].y < triangle[1].y) {
		if (triangle[0].y < triangle[2].y) { p0 = triangle[0]; }
		else { p0 = triangle[2]; total += 2; } 
	} else {
		if (triangle[1].y < triangle[2].y) { p0 = triangle[1]; total += 1; }
		else { p0 = triangle[2]; total += 2; }
	}

	// find the highest Y
	if (triangle[0].y > triangle[1].y) {
		if (triangle[0].y > triangle[2].y) { p2 = triangle[0]; }
		else { p2 = triangle[2]; total += 2; }
	} else {
		if (triangle[1].y > triangle[2].y) { p2 = triangle[1]; total += 1; }
		else { p2 = triangle[2]; total += 2; }
	}

	// and the middle one is a matter of deduction
	p1 = triangle[3 - total];  
 
    var dx_far = (p2.x - p0.x) / (p2.y - p0.y + 1);
    var dx_upper = (p1.x - p0.x) / (p1.y - p0.y + 1);
    var dx_low = (p2.x - p1.x) / (p2.y - p1.y + 1);
    var xf = p0.x;
    var xt = p0.x + dx_upper; // if p0.y == p1.y, special case
    for (var y = p0.y; y <= p2.y; y++)
    {
        if (y >= 0)
        {
            for (var x = (xf > 0 ? Math.floor(xf) : 0); x <= xt; x++)
                points.push({x:Math.floor(x), y:Math.floor(y)});
            for (var x = Math.floor(xf); x >= (xt > 0 ? xt : 0); x--)
                points.push({x:Math.floor(x), y:Math.floor(y)});
        }
        xf += dx_far;
        if (y < p1.y)
            xt += dx_upper;
        else
            xt += dx_low;
    }

    return points;
}

// Clamping values to keep them between 0 and 1
function Clamp(value)
{
    return Math.max(0, Math.min(value, 1));
}

// Interpolating the value between 2 vertices 
// min is the starting point, max the ending point
// and gradient the % between the 2 points
function Interpolate(min, max, gradient)
{
    return min + (max - min) * Clamp(gradient);
}

function ProcessScanLine(y, pa, pb, pc, pd)
{
	var lines = []
    // Thanks to current Y, we can compute the gradient to compute others values like
    // the starting X (sx) and ending X (ex) to draw between
    // if pa.Y == pb.Y or pc.Y == pd.Y, gradient is forced to 1
    var gradient1 = pa.y != pb.y ? (y - pa.y) / (pb.y - pa.y) : 1;
    var gradient2 = pc.y != pd.y ? (y - pc.y) / (pd.y - pc.y) : 1;
            
    var sx = Math.floor(Interpolate(pa.x, pb.x, gradient1));
    var ex = Math.floor(Interpolate(pc.x, pd.x, gradient2));

    // drawing a line from left (sx) to right (ex) 
    for (var x = sx; x < ex; x++)
    {
        lines.push({x:x, y:y});
    }
    return lines;
}

function DrawTriangle(p1, p2, p3)
{
	var points = [];
    // Sorting the points in order to always have this order on screen p1, p2 & p3
    // with p1 always up (thus having the Y the lowest possible to be near the top screen)
    // then p2 between p1 & p3
    if (p1.y > p2.y)
    {
        var temp = p2;
        p2 = p1;
        p1 = temp;
    }

    if (p2.y > p3.y)
    {
        var temp = p2;
        p2 = p3;
        p3 = temp;
    }

    if (p1.y > p2.y)
    {
        var temp = p2;
        p2 = p1;
        p1 = temp;
    }

    // inverse slopes
    var dP1P2, dP1P3;

    // http://en.wikipedia.org/wiki/Slope
    // Computing inverse slopes
    if (p2.y - p1.y > 0)
        dP1P2 = (p2.x - p1.x) / (p2.y - p1.y);
    else
        dP1P2 = 0;

    if (p3.y - p1.y > 0)
        dP1P3 = (p3.x - p1.x) / (p3.y - p1.y);
    else
        dP1P3 = 0;

    // First case where triangles are like that:
    // P1
    // -
    // -- 
    // - -
    // -  -
    // -   - P2
    // -  -
    // - -
    // -
    // P3
    if (dP1P2 > dP1P3)
    {
        for (var y = p1.y; y <= p3.y; y++)
        {
            if (y < p2.y)
            {
                points.push.apply(points, ProcessScanLine(y, p1, p3, p1, p2));
            }
            else
            {
                points.push.apply(points, ProcessScanLine(y, p1, p3, p2, p3));
            }
        }
    }
    // First case where triangles are like that:
    //       P1
    //        -
    //       -- 
    //      - -
    //     -  -
    // P2 -   - 
    //     -  -
    //      - -
    //        -
    //       P3
    else
    {
        for (var y = p1.y; y <= p3.y; y++)
        {
            if (y < p2.y)
            {
                points.push.apply(points, ProcessScanLine(y, p1, p2, p1, p3));
            }
            else
            {
                points.push.apply(points, ProcessScanLine(y, p2, p3, p1, p3));
            }
        }
    }
    return points;
}