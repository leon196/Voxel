using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

public class Engine : MonoBehaviour {

	private Utils tools;
	private Voxel[] voxels;

	public GameObject prefab;
	public Mesh mesh;
	public float scale = 1.0f;
	public TextMesh tmPrefab;
	private GameObject rootCubes;
	private int cubeCount = 0;

	// Use this for initialization
	void Start () {
		tools = new Utils();
		voxels = new Voxel[0];

		rootCubes = new GameObject();
		rootCubes.name = "rootCubes";

		if (mesh) {

			// Mesh Size
			Vector3 meshSize = new Vector3(Mathf.Ceil(mesh.bounds.size.x * scale + 1.0f), Mathf.Ceil(mesh.bounds.size.y * scale + 1.0f), Mathf.Ceil(mesh.bounds.size.z * scale + 1.0f));
			Vector3 meshHalfSize = new Vector3(Mathf.Ceil(mesh.bounds.extents.x * scale), Mathf.Ceil(mesh.bounds.extents.y * scale), Mathf.Ceil(mesh.bounds.extents.z * scale));

			// Voxels
			uint dimensionMax = (uint)(Mathf.Ceil(Mathf.Max(meshSize.x, Mathf.Max(meshSize.y, meshSize.z))));
			uint voxelCount = (uint)Mathf.Ceil(dimensionMax * dimensionMax * dimensionMax);
			Debug.Log("voxelCount:" + voxelCount);
			voxels = new Voxel[voxelCount];

			// Tris
			Vector3 min = new Vector3();
			Vector3 max = new Vector3();
			Vector3 center = new Vector3();
			Vector3 size = new Vector3();
			Vector3 boxhalfsize = new Vector3();
			AABox box = new AABox();
			Triangle tri = new Triangle();

			int countVertices = mesh.vertices.Length;
			int countTri = mesh.triangles.Length;
			Vector3[] meshVertices = new Vector3[countVertices];
			for (int v = 0; v < countVertices; v++) {
				meshVertices[v] = mesh.vertices[v];
			}
			int[] meshTriangles = mesh.triangles;
			
			/*
			// Texts
			for (int v = 0; v < voxelCount; ++v) {

				float x = v % dimensionMax * scale;
				float y = Mathf.Floor( v / (dimensionMax * dimensionMax )) % dimensionMax * scale;
				float z = Mathf.Floor( v / dimensionMax ) % dimensionMax * scale;
				Vector3 pos = new Vector3((float)x, (float)y, (float)z);
				TextMesh tm = GameObject.Instantiate( tmPrefab, pos + new Vector3(dimensionMax/2, dimensionMax/2, dimensionMax/2), Quaternion.identity ) as TextMesh;
				tm.text = v.ToString();
				tm.transform.parent = transform;
			}
			*/

			// For each triangles
			countTri = meshTriangles.Length;
			Debug.Log("countTri:" + (countTri/3));
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
							GameObject cube = AddCube(new Vector3((float)(min.x + x + 0.5f), (float)(min.y + y + 0.5f), (float)(min.z + z + 0.5f)));
							cube.renderer.material.color = new Color((float)(tri.normal.x + 1.0f)/2.0f, (float)(tri.normal.y + 1.0f)/2.0f, (float)(tri.normal.z + 1.0f)/2.0f);
							//cube.renderer.material.color = tri.normal.y > 0.0f ? Color.red : Color.blue;
							// Voxel taken
							voxels[indexVoxel] = new Voxel(indexVoxel, box.start, tri.normal, cube);
						}
					} 
				}
			}

			// Fill Surfaces
			int current = -1;
			List<Voxel> columns = new List<Voxel>();
			//uint[] intersections = new uint[(int)meshSize.y];
			// The first slice of the grid
			int sliceCount = (int)(meshSize.x * meshSize.y);
			for (int s = 0; s < sliceCount; ++s) {
				float x = s % meshSize.x;
				float z = Mathf.Floor(s / meshSize.x) % meshSize.z;
				current = -1;
				columns.Clear();
				// For each colum of the voxel picked from slice
				for (int c = 0; c < meshSize.y; ++c) {
					int indexVoxel = (int)(s + c * meshSize.x * meshSize.z);
					Voxel voxel = voxels[indexVoxel];
					// If voxel
					if (voxel != null) {
						// Grab it
						columns.Add(voxel);
					}
				}
				if (columns.Count > 1) {
					for (int c = 0; c < columns.Count; ++c) {
						Voxel voxel = columns[c];
						if (voxel.normal.y <= 0) {
							current = voxel.index;
						} else if (voxel.normal.y > 0) {
							if (current != -1) {
								Voxel currentVoxel = voxels[current];
								for (int v = (int)currentVoxel.y + 1; v < (int)voxel.y; ++v) {
									GameObject cube = AddCube(new Vector3(x + 0.5f, v + 0.5f, z + 0.5f));
									cube.renderer.material.color = Color.black;
									int indexVoxelColumn = (int)(s + v * meshSize.x * meshSize.z);
									// Voxel taken
									voxels[indexVoxelColumn] = new Voxel(indexVoxelColumn, new Vector3(x, v, z), Vector3.zero, cube);
								}
								//current = -1;
							}
						}
					}
				}
			}
			
		}

		Debug.Log("cubeCount:" + cubeCount);
	}

	GameObject AddCube(Vector3 position) {
		GameObject cube = Instantiate(prefab, position, Quaternion.identity) as GameObject;
		cube.transform.parent = rootCubes.transform;
		++cubeCount;
		return cube;
	}

	void Update() {
		/*
		if (Input.GetButtonDown("Fire1")) {
			int count = voxels.Length;
			for (int v = 0; v < count; v++) {
				Voxel voxel = voxels[v];
				if (voxel != null) {
					voxel.cube.rigidbody.isKinematic = false;
					voxel.cube.rigidbody.WakeUp();
					voxel.cube.rigidbody.AddExplosionForce(50.0f, mesh.bounds.extents * scale, mesh.bounds.extents.x, 0.0f, ForceMode.Impulse);
				}
			}
		}
		*/
	}


}

						/*
					if (voxel.normal.y < 0.0f) {
						current = indexVoxel;
					} else {
						current = -1;
						Voxel currentVoxel = voxels[current];
						if (currentVoxel.normal.y < 0.0f && voxel.normal.y > 0.0f) {
							int differenceY = (int)(voxel.y - currentVoxel.y);
							if (differenceY > 1) {
								//
								for (int y = (int)currentVoxel.y + 1; y < c; ++y) {
									GameObject cube = AddCube(new Vector3(x + 0.5f, y + 0.5f, z + 0.5f));
									cube.renderer.material.color = Color.black;
									//Debug.Log("yo?");
									int indexVoxelColumn = (int)(s + y * meshSize.x * meshSize.z);
									// Voxel taken
									voxels[indexVoxelColumn] = new Voxel((uint)indexVoxelColumn, new Vector3(x, y, z), Vector3.zero, cube);
								}
								current = -1;
							} else {
								current = (int)indexVoxel;
							}
						} else { 
							current = (int)indexVoxel;
						}
						}
					} else {
						if (current != -1) {
							GameObject cube = AddCube(new Vector3(x + 0.5f, c + 0.5f, z + 0.5f));
							cube.renderer.material.color = Color.black;
							// Voxel taken
							voxels[indexVoxel] = new Voxel((uint)indexVoxel, new Vector3(x, c, z), Vector3.zero, cube);
						}
					}
						*/
