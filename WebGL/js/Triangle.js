Engine.Triangle = function(a_, b_, c_)
{
	// Vertices
	this.a = a_;
	this.b = b_;
	this.c = c_;

	// Normal
	this.normal = this.CalculateNormal();
	this.CalculateNormal = function() {
		var n = new THREE.Vector3(0,0,0);
		var ab = (new THREE.Vector3(0,0,0)).subVectors(this.b, this.a);
		var ac = (new THREE.Vector3(0,0,0)).subVectors(this.c, this.a);
		return n.crossVectors(ab, ac).normalize();
	};

	// Mininum position of the triangle bounds
	this.min = this.CalculateBoundsMin();
	this.CalculateBoundsMin = function() {
		var v = new Engine.Vector3();
		v.x = Math.floor(Math.min(this.a.x, Math.min(this.b.x, this.c.x)));
		v.y = Math.floor(Math.min(this.a.y, Math.min(this.b.y, this.c.y))); 
		v.z = Math.floor(Math.min(this.a.z, Math.min(this.b.z, this.c.z)));
		return v;
	};

	// Mininum position of the triangle bounds
	this.max = this.CalculateBoundsMax();
	this.CalculateBoundsMax = function() {
		var v = new Engine.Vector3();
		v.x = Math.ceil(Math.max(this.a.x, Math.max(this.b.x, this.c.x)));
		v.y = Math.ceil(Math.max(this.a.y, Math.max(this.b.y, this.c.y)));
		v.z = Math.ceil(Math.max(this.a.z, Math.max(this.b.z, this.c.z)));
		if (Math.abs(v.x - this.min.x) < 1) { v.x += 1; }
		else if (Math.abs(v.y - this.min.y) < 1) { v.y += 1; }
		else if (Math.abs(v.z - this.min.z) < 1) { v.z += 1; }
		return v;
	};

	// Centroid
    // this.centroid = (this.a + this.b + this.c) / 3;
};