#version 330 core
//layout(location = 0) in vec3 vertexPosition_modelspace;
in vec2 texcoord;

void main()
{
    gl_Position = gl_ProjectionMatrix * gl_ModelViewMatrix * gl_Vertex;
    gl_TexCoord[0] = gl_MultiTexCoord0;
    //gl_Position.xyz = vertexPosition_modelspace;
    //gl_Position.w = 1.0;
 }
