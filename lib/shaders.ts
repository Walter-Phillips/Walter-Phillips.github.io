const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// Sail — wave interference / moiré pattern
const sailFragment = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);

  // Two wave sources that orbit near center
  vec2 s1 = vec2(sin(u_time * 0.3) * 0.12, cos(u_time * 0.2) * 0.1);
  vec2 s2 = vec2(cos(u_time * 0.25) * 0.12, sin(u_time * 0.35) * 0.1);

  float d1 = length(p - s1);
  float d2 = length(p - s2);

  // Concentric wave fields
  float w1 = sin(d1 * 30.0 - u_time * 2.0) * 0.5 + 0.5;
  float w2 = sin(d2 * 30.0 - u_time * 2.5) * 0.5 + 0.5;

  // Interference pattern
  float interference = w1 * w2;

  // Horizontal wave flow
  float flow = sin(p.x * 8.0 + p.y * 3.0 - u_time * 1.5) * 0.5 + 0.5;

  // Black and white palette
  vec3 deep = vec3(0.02);
  vec3 mid = vec3(0.35);
  vec3 bright = vec3(0.85);

  vec3 col = mix(deep, mid, interference);
  col = mix(col, bright, flow * interference * 0.5);

  // Foam highlights
  float foam = smoothstep(0.92, 0.98, interference);
  col += vec3(0.9) * foam * 0.4;

  // Depth fade at edges
  float vignette = 1.0 - length(p) * 0.4;
  col *= vignette;

  gl_FragColor = vec4(col, 1.0);
}
`;

export const shaders: Record<string, { vertex: string; fragment: string }> = {
  sail: { vertex: VERTEX_SHADER, fragment: sailFragment },
};
