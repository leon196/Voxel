Engine.Triangle = function(a_, b_, c_)
{
	// Vertices
	this.a = a_;
	this.b = b_;
	this.c = c_;

	// Normal
	this.normal = TriangleNormal(this);

	// Mininum position of the triangle bounds
	this.min = TriangleBoundsMin(this);
    
	// Mininum position of the triangle bounds
	this.max = TriangleBoundsMax(this);
    
    // Bounds Size
    this.size = TriangleSize(this);
    
	// Centroid
    // this.centroid = (this.a + this.b + this.c) / 3;
};


function TriangleNormal(triangle) {
    var n = new THREE.Vector3(0,0,0);
    var ab = (new THREE.Vector3(0,0,0)).subVectors(triangle.b, triangle.a);
    var ac = (new THREE.Vector3(0,0,0)).subVectors(triangle.c, triangle.a);
    return n.crossVectors(ab, ac).normalize();
}

function TriangleBoundsMin(triangle) {
    var v = new Engine.Vector3();
    v.x = Math.floor(Math.min(triangle.a.x, Math.min(triangle.b.x, triangle.c.x)));
    v.y = Math.floor(Math.min(triangle.a.y, Math.min(triangle.b.y, triangle.c.y))); 
    v.z = Math.floor(Math.min(triangle.a.z, Math.min(triangle.b.z, triangle.c.z)));
    return v;
}

function TriangleBoundsMax(triangle) {
    var v = new Engine.Vector3();
    v.x = Math.ceil(Math.max(triangle.a.x, Math.max(triangle.b.x, triangle.c.x)));
    v.y = Math.ceil(Math.max(triangle.a.y, Math.max(triangle.b.y, triangle.c.y)));
    v.z = Math.ceil(Math.max(triangle.a.z, Math.max(triangle.b.z, triangle.c.z)));
    if (Math.abs(v.x - triangle.min.x) < 1) { v.x += 1; }
    else if (Math.abs(v.y - triangle.min.y) < 1) { v.y += 1; }
    else if (Math.abs(v.z - triangle.min.z) < 1) { v.z += 1; }
    return v;
}

function TriangleSize(triangle) {   
    var size = new Engine.Vector3();
    size.x = Math.abs(triangle.max.x - triangle.min.x);
    size.y = Math.abs(triangle.max.y - triangle.min.y);
    size.z = Math.abs(triangle.max.z - triangle.min.z);
    return size;
}