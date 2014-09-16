using UnityEngine;
using System.Collections;

public class Voxel : MonoBehaviour
{
	public Vector3[] newVertices;
    public Vector2[] newUV;
    public int[] newTriangles;

    void Start()
    {
    	int countV = 16;
    	float radius = 3.0f;
    	newVertices = new Vector3[countV + 1];
    	newUV = new Vector2[countV + 1];
    	newTriangles = new int[countV * 3];

    	for (int c = 0; c < countV; ++c) {
    		float ratio = c/countV;
    		float x = Mathf.Cos(ratio * Mathf.PI * 2.0f) * radius;
    		float y = radius;
    		float z = Mathf.Sin(ratio * Mathf.PI * 2.0f) * radius;
    		newVertices[c] = new Vector3(x, y, z);
    		newUV[c] = new Vector2();
    	}

    	newVertices[countV] = new Vector3();
    	newUV[countV] = new Vector2();

    	for (int f = 0; f < countV * 3; ++f) {
    		newTriangles[f] = (int)((f%3) + Mathf.Floor(f/countV));
    	}

        Mesh mesh = new Mesh();
        GetComponent<MeshFilter>().mesh = mesh;
        mesh.vertices = newVertices;
        mesh.uv = newUV;
        mesh.triangles = newTriangles;
    }
	
	void Update ()
	{/*        Mesh mesh = GetComponent<MeshFilter>().mesh;
        Vector3[] vertices = mesh.vertices;
        Vector3[] normals = mesh.normals;
        int i = 0;
        while (i < vertices.Length) {
            vertices[i] += normals[i] * Mathf.Sin(Time.time);
            i++;
        }
        mesh.vertices = vertices;
        */
	}
}
