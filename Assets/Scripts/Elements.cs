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

public class Octree {
	// Physical position/size. This implicitly defines the bounding 
	// box of this node
	public Vector3 origin;         //! The physical center of this node
	public Vector3 halfDimension;  //! Half the width/height/depth of this node

	// The tree has up to eight children and can additionally store
	// a point, though in many applications only, the leaves will store data.
	public Octree[] children; //! Pointers to child octants
	public OctreePoint data;   //! Data point to be stored at a node

	/*
			Children follow a predictable pattern to make accesses simple.
			Here, - means less than 'origin' in that dimension, + means greater than.
			child:	0 1 2 3 4 5 6 7
			x:      - - - - + + + +
			y:      - - + + - - + +
			z:      - + - + - + - +
	 */
	public Octree(Vector3 origin_, Vector3 halfDimension_) {
		origin = origin_;
		halfDimension = halfDimension_;
		data = null;
		// Initially, there are no children
		children = new Octree[8];
		for (int i = 0; i < 8; ++i) {
			children[0] = null;
		}
	}	

	public Octree(Octree copy) {
		origin = copy.origin;
		halfDimension = copy.halfDimension;
		data = copy.data;
	}

	// Determine which octant of the tree would contain 'point'
	public int getOctantContainingPoint(Vector3 point) {
		int oct = 0;
		if(point.x >= origin.x) oct |= 4;
		if(point.y >= origin.y) oct |= 2;
		if(point.z >= origin.z) oct |= 1;
		return oct;
	}

	public bool isLeafNode() {
		// We are a leaf iff we have no children. Since we either have none, or 
		// all eight, it is sufficient to just check the first.
		return children[0] == null;
	}

	public void insert(OctreePoint point) {
		// If this node doesn't have a data point yet assigned 
		// and it is a leaf, then we're done!
		if (isLeafNode()) {
			if (data == null) {
				data = point;
				return;
			} else {
				// We're at a leaf, but there's already something here
				// We will split this node so that it has 8 child octants
				// and then insert the old data that was here, along with 
				// this new data point

				// Save this data point that was here for a later re-insert
				OctreePoint oldPoint = data;
				data = null;

				// Split the current node and create new empty trees for each
				// child octant.
				for(int i=0; i<8; ++i) {
					// Compute new bounding box for this child
					Vector3 newOrigin = origin;
					newOrigin.x += halfDimension.x * ((i&4) != 0 ? .5f : -.5f);
					newOrigin.y += halfDimension.y * ((i&2) != 0 ? .5f : -.5f);
					newOrigin.z += halfDimension.z * ((i&1) != 0 ? .5f : -.5f);
					children[i] = new Octree(newOrigin, halfDimension*.5f);
				}

				// Re-insert the old point, and insert this new point
				// (We wouldn't need to insert from the root, because we already
				// know it's guaranteed to be in this section of the tree)
				children[getOctantContainingPoint(oldPoint.position)].insert(oldPoint);
				children[getOctantContainingPoint(point.position)].insert(point);
			}
		} else {
			// We are at an interior node. Insert recursively into the 
			// appropriate child octant
			int octant = getOctantContainingPoint(point.position);
			children[octant].insert(point);
		}
	}

	// This is a really simple routine for querying the tree for points
	// within a bounding box defined by min/max points (bmin, bmax)
	// All results are pushed into 'results'
	public void getPointsInsideBox(Vector3 bmin, Vector3 bmax, List<OctreePoint> results) {
		if (results == null) { results = new List<OctreePoint>(); }
		// If we're at a leaf node, just see if the current data point is inside
		// the query bounding box
		if (isLeafNode()) {
			if (data != null) {
				Vector3 p = data.position;
				if (p.x>bmax.x || p.y>bmax.y || p.z>bmax.z) return;
				if (p.x<bmin.x || p.y<bmin.y || p.z<bmin.z) return;
				results.Add(data);
			}
		} else {
			// We're at an interior node of the tree. We will check to see if
			// the query bounding box lies outside the octants of this node.
			for(int i=0; i<8; ++i) {
				// Compute the min/max corners of this child octant
				Vector3 cmax = children[i].origin + children[i].halfDimension;
				Vector3 cmin = children[i].origin - children[i].halfDimension;

				// If the query rectangle is outside the child's bounding box, 
				// then continue
				if(cmax.x<bmin.x || cmax.y<bmin.y || cmax.z<bmin.z) continue;
				if(cmin.x>bmax.x || cmin.y>bmax.y || cmin.z>bmax.z) continue;

				// At this point, we've determined that this child is intersecting 
				// the query bounding box
				children[i].getPointsInsideBox(bmin,bmax,results);
			} 
		}
	}
}
