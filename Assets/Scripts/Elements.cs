using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

// Shape
public class Shape
{
	public Vector3[] vertices;
}

// Triangle
public class Triangle : Shape
{
    public Vector3 a, b, c, normal, centroid;
	public Triangle () {}

	// Compute normal
    public Vector3 Normal {
	    get {
	        Vector3 dir = Vector3.Cross(b - a, c - a);
	        Vector3 norm = Vector3.Normalize(dir);
	        return norm;
	    }
	}
}

// Bounding Box
public class AABox : Shape
{
	public Vector3 start, end;
	public AABox () {}

	// Specific function for making easier iterations
	public double StartCoords (int index) { 
		double coords = start.x;switch (index) { case 1 : coords = start.y; break; case 2 : coords = start.z; break; } return coords;}
	public double EndCoords (int index) { 
		double coords = end.x;switch (index) { case 1 : coords = end.y; break; case 2 : coords = end.z; break; } return coords;}
}

// Brandon Pelfrey's Octree class
// Translated to C# by Leon & Naima

// Octree Point
public class OctreePoint {
	public Vector3 position; 
	public OctreePoint() {}
}