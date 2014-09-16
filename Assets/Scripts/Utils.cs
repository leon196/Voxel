using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

public class Utils {
	
	// Triangle / Bounding Box (AABB) Intersection Test
	public bool IsIntersecting(AABox box, Triangle triangle) {
	    float triangleMin, triangleMax;
	    float boxMin, boxMax;

	    // Test the box normals
	    Vector3[] boxNormals = { Vector3.right, Vector3.up, Vector3.forward };
	    for (int i = 0; i < 3; i++) {
		    Project(triangle.vertices, boxNormals[i], out triangleMin, out triangleMax);
		    if (triangleMax < box.StartCoords(i) || triangleMin > box.EndCoords(i))
		        return false;
	    }
	    // Test the triangle normal
	    float triangleOffset = Vector3.Dot(triangle.normal, triangle.a);
	    Project(box.vertices, triangle.normal, out boxMin, out boxMax);
	    if (boxMax < triangleOffset || boxMin > triangleOffset)
	        return false;

	    // Test the nine edge cross-products
	    Vector3[] triangleEdges = { triangle.b - triangle.a, triangle.b - triangle.c, triangle.b - triangle.c };
	    for (int i = 0; i < 3; i++) {
		    for (int j = 0; j < 3; j++) {
		        // The box normals are the same as it's edge tangents
		        Vector3 axis = Vector3.Cross(triangleEdges[i], boxNormals[j]);
		        Project(box.vertices, axis, out boxMin, out boxMax);
		        Project(triangle.vertices, axis, out triangleMin, out triangleMax);
		        if (boxMax < triangleMin || boxMin > triangleMax)
		            return false; // No intersection possible
		    }
		}

	    // No separating axis found.
	    return true;
	}

	// Project points
	public void Project(Vector3[] points, Vector3 axis, out float min, out float max) {
	    min = float.PositiveInfinity;
	    max = float.NegativeInfinity;
	    foreach (var p in points)
	    {
	        float val = Vector3.Dot(axis, p);
	        if (val < min) min = val;
	        if (val > max) max = val;
	    }
	}
/*
	public void DrawLine (Vector3 p0, Vector3 p1)
	{
		Vector3 vec = (p1 - p0);
		Vector3 dir = vec.normalized;
		Vector3 p = new Vector3();
		int dist = (int)Mathd.Ceil(vec.magnitude);
		for (int i = 0; i < dist; ++i) {
			p = p0 + i * dir;
			p.x = Mathd.Floor(p.x);
			p.y = Mathd.Floor(p.y);
			p.z = Mathd.Floor(p.z);
			AddCube(p);
		}
	}	
*/
	//public void 

	/*
	// Shell surface
	Vector3[] meshVertices = new Vector3[countVertices * 2];
	int[] meshTriangles = new int[countTri * 2];
	for (int v = 0; v < countVertices; v++) {
		meshVertices[v] = new Vector3(mesh.vertices[v]);
	}
	for (int v = 0; v < countVertices; v++) {
		meshVertices[countVertices + v] = new Vector3(mesh.vertices[v] * 1.5f);
	}
	for (int t = 0; t < countTri; t++) {
		meshTriangles[t] = mesh.triangles[t];
	}
	for (int t = 0; t < countTri; t++) {
		meshTriangles[countTri + t] = mesh.triangles[t] + countVertices;
	}
	*/



	//for (int v = 0; v < voxels.Count; v++) {
	//	voxels[v].renderer.material.color = Color.Lerp(Color.red, Color.green, v / (float)cubeCount);
	//}



	//GameObject cube = AddCube(center);
	//cube.transform.localScale = tri.Normal;


	/*
	Vector3 pos = new Vector3((float)box.start.x, (float)box.start.y, (float)box.start.z);
	TextMesh tm = GameObject.Instantiate( tmPrefab, pos, Quaternion.identity ) as TextMesh;
	tm.text = indexVoxel.ToString();
	tm.transform.parent = transform;
	*/

	/********************************************************/
	/* AABB-triangle overlap test code                      */
	/* by Tomas Akenine-Möller                              */
	/* Adapted from C++ by Leon & Naima						*/
	/********************************************************/

	public const int X = 0;
	public const int Y = 1;
	public const int Z = 2;

	int planeBoxOverlap(Vector3 normal, Vector3 vert, Vector3 maxbox)
	{
		int q;
		float v;
		Vector3 vmin, vmax;
		if(normal.x > 0.0f) { vmin.x = -maxbox.x - vert.x; vmax.x = maxbox.x - vert.x;	}
		else { vmin.x = maxbox.x - vert.x; vmax.x = -maxbox.x - vert.x; }
		if(normal.y > 0.0f) { vmin.y = -maxbox.y - vert.y; vmax.y = maxbox.y - vert.y;	}
		else { vmin.y = maxbox.y - vert.y; vmax.y = -maxbox.y - vert.y; }
		if(normal.z > 0.0f) { vmin.z = -maxbox.z - vert.z; vmax.z = maxbox.z - vert.z;	}
		else { vmin.z = maxbox.z - vert.z; vmax.z = -maxbox.z - vert.z; }
		if (Vector3.Dot(normal,vmin) > 0.0f) return 0;	
		if (Vector3.Dot(normal,vmax) >= 0.0f) return 1;	
		return 0;
	}

	public int triBoxOverlap(Vector3 boxcenter, Vector3 boxhalfsize, Triangle triangle)
	{
		Vector3 v0, v1, v2;
		float min, max, p0, p1, p2, rad, fex, fey, fez;
		Vector3 normal, e0, e1, e2;

		/* This is the fastest branch on Sun */
		/* move everything so that the boxcenter is in (0,0,0) */
		v0 = triangle.a - boxcenter;
		v1 = triangle.b - boxcenter;
		v2 = triangle.c - boxcenter;
		/* compute triangle edges */
		e0 = v1 - v0;
		e1 = v2 - v1;
		e2 = v0 - v2;

		/* Bullet 3:  */
		/*  test the 9 tests first (this was faster) */
		fex = Mathf.Abs(e0.x);
		fey = Mathf.Abs(e0.y);
		fez = Mathf.Abs(e0.z);
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
		fex = Mathf.Abs(e1.x);
		fey = Mathf.Abs(e1.y);
		fez = Mathf.Abs(e1.z);
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
		fex = Mathf.Abs(e2.x);
		fey = Mathf.Abs(e2.y);
		fez = Mathf.Abs(e2.z);
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
		min = Mathf.Min(v0.x, Mathf.Min(v1.x, v2.x));
		max = Mathf.Max(v0.x, Mathf.Max(v1.x, v2.x));
		if (min > boxhalfsize.x || max < -boxhalfsize.x) return 0;
		/* test in Y-direction */
		min = Mathf.Min(v0.y, Mathf.Min(v1.y, v2.y));
		max = Mathf.Max(v0.y, Mathf.Max(v1.y, v2.y));
		if (min > boxhalfsize.y || max < -boxhalfsize.y) return 0;
		/* test in Z-direction */
		min = Mathf.Min(v0.z, Mathf.Min(v1.z, v2.z));
		max = Mathf.Max(v0.z, Mathf.Max(v1.z, v2.z));
		if (min > boxhalfsize.z || max < -boxhalfsize.z) return 0;
		/* Bullet 2: */
		/*  test if the box intersects the plane of the triangle */
		/*  compute plane equation of triangle: normal*x+d=0 */
		normal = Vector3.Cross(e0, e1);
		if ( 0 == planeBoxOverlap(normal, v0, boxhalfsize)) return 0;	
		return 1;   /* box and triangle overlaps */
	}
}
