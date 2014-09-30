#extension GL_OES_standard_derivatives : enable

varying vec2 vUv;

void main() {

	float value = step(mod(gl_FragCoord.x + gl_FragCoord.y, 20.0), 10.0);//step(0.9, vUv.x) + step(0.9, 1.0 - vUv.x) + step(0.9, vUv.y) + step(0.9, 1.0 - vUv.y);
	gl_FragColor.rgb = vec3(0, value, 0);
	gl_FragColor.a = value * 0.2;
}