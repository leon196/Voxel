
// For each triangles
countTri = meshTriangles.Length;
console.log("countTri:" + (countTri/3));
for (int t = 0; t+2 < countTri; t += 3) {

	// Triangle
	tri.a = meshVertices[meshTriangles[t]] * scale + meshHalfSize;
	tri.b = meshVertices[meshTriangles[t+1]] * scale + meshHalfSize;
	tri.c = meshVertices[meshTriangles[t+2]] * scale + meshHalfSize;
    tri.normal = Vector3.Normalize(Vector3.Cross(tri.b - tri.a, tri.c - tri.a));
    tri.centroid = (tri.a + tri.b + tri.c) / 3.0f;
	Vector3[] vertices = { tri.a, tri.b, tri.c };
	tri.vertices = vertices;

	// Min & Max
	min.x = Mathf.Floor(Mathf.Min(tri.a.x, Mathf.Min(tri.b.x, tri.c.x)));
	min.y = Mathf.Floor(Mathf.Min(tri.a.y, Mathf.Min(tri.b.y, tri.c.y))); 
	min.z = Mathf.Floor(Mathf.Min(tri.a.z, Mathf.Min(tri.b.z, tri.c.z)));
	max.x = Mathf.Ceil(Mathf.Max(tri.a.x, Mathf.Max(tri.b.x, tri.c.x)));
	max.y = Mathf.Ceil(Mathf.Max(tri.a.y, Mathf.Max(tri.b.y, tri.c.y)));
	max.z = Mathf.Ceil(Mathf.Max(tri.a.z, Mathf.Max(tri.b.z, tri.c.z)));
	if (Mathf.Abs(max.x - min.x) < 1.0f) { max.x += 1.0f; }
	else if (Mathf.Abs(max.y - min.y) < 1.0f) { max.y += 1.0f; }
	else if (Mathf.Abs(max.z - min.z) < 1.0f) { max.z += 1.0f; }

	// Bounds
	size.x = Mathf.Abs(max.x - min.x);
	size.y = Mathf.Abs(max.y - min.y);
	size.z = Mathf.Abs(max.z - min.z);
	center = min + new Vector3(Mathf.Floor(size.x / 2), Mathf.Floor(size.y / 2), Mathf.Floor(size.z / 2));
	//Bounds triBounds = new Bounds(center, size);

	// For each voxel in bounds
	int gridCount = (int)(size.x * size.y * size.z);
	for (int v = 0; v < gridCount; ++v) {

		// Position in grid
		float x = v % size.x;
		float y = Mathf.Floor( v / (size.x * size.z )) % size.y;
		float z = Mathf.Floor( v / size.x ) % size.z;

		// voxel bound
		box.start.x = min.x + x;
		box.start.y = min.y + y;
		box.start.z = min.z + z;
		box.end.x = min.x + x + 1;
		box.end.y = min.y + y + 1;
		box.end.z = min.z + z + 1;
		Vector3[] boxVertices = { box.start, box.end };
		box.vertices = boxVertices;

		// Unique ID by position
		int indexVoxel = (int)(min.x + x + (min.z + z) * meshSize.x + (min.y + y) * (meshSize.x * meshSize.z));
		Voxel voxel = voxels[indexVoxel];
		if (voxel == null) {
			// Intersection test
			if (0 != tools.triBoxOverlap(box.start + new Vector3(0.5f, 0.5f, 0.5f), new Vector3(0.5f, 0.5f, 0.5f), tri)) {
				Vector3 pos = new Vector3(min.x + x + 0.5f, min.y + y + 0.5f, min.z + z + 0.5f);
				//GameObject cube = AddCube(new Vector3((float)(min.x + x + 0.5f), (float)(min.y + y + 0.5f), (float)(min.z + z + 0.5f)), Vector3.one);
				//cube.renderer.material.color = new Color((float)(tri.normal.x + 1.0f)/2.0f, (float)(tri.normal.y + 1.0f)/2.0f, (float)(tri.normal.z + 1.0f)/2.0f);
				//cube.renderer.material.color = tri.normal.y > 0.0f ? Color.red : Color.blue;
				// Voxel taken
				voxels[indexVoxel] = new Voxel(indexVoxel, box.start, tri.normal, null);
				OctreePoint octreePoint = new OctreePoint();
				octreePoint.position = pos;
				octree.insert(octreePoint);
			}
		} 
	}
}