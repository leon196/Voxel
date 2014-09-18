using UnityEngine;
using System.Collections;

using UnityEngine;

public class Voxel
{
    public int index;
    public float x, y, z;
    public Vector3 normal;
    public GameObject cube;

    public Voxel(int voxelIndex, Vector3 voxelPosition, Vector3 voxelNormal, GameObject voxelCube) {
        index = voxelIndex;
        x = voxelPosition.x;
        y = voxelPosition.y;
        z = voxelPosition.z;
        normal = voxelNormal;
        cube = voxelCube;
    }
}
