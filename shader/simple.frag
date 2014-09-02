#version 330 core
out vec3 color;
uniform float timeElapsed = 0.0;

void main(){
    //float grid = step(10.0, mod(gl_FragCoord.y, 14.0)) + step(10.0, mod(gl_FragCoord.x, 14.0));
    //color = vec3((sin(timeElapsed + gl_TexCoord[0].y) + 1.0) / 2.0, (cos(timeElapsed + gl_TexCoord[0].x) + 1.0) / 2.0, 1.0);
    color = vec3((sin(timeElapsed + gl_TexCoord[0].x) + 1.0) / 2.0, (cos(timeElapsed + gl_TexCoord[0].y) + 1.0) / 2.0, 0.0);
}
