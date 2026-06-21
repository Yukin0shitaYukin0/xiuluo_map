import { useMemo } from 'react';
import * as THREE from 'three';

// ---- GLSL 噪声函数 ----
const noiseGLSL = /* glsl */ `
  // Permutation polynomial: (34x^2 + x) mod 289
  vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
  }

  // 2D Perlin noise (简化版)
  float perlin2D(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0);
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
    vec4 gy = 2.0 * fract(i * 0.0724637681 + 0.5) - 1.0;
    vec4 res = 0.5 + 0.5 * (gx * fx + gy * fy);
    res = mix(res, res.xzyw, 0.5);
    return res.x;
  }

  // 2D Worley noise
  float worley2D(vec2 uv) {
    vec2 i = floor(uv);
    vec2 f = fract(uv);
    float minDist = 1.0;
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 point = fract(sin(vec2(dot(i + neighbor, vec2(127.1, 311.7)), dot(i + neighbor, vec2(269.5, 183.3)))) * 43758.5453);
        vec2 diff = neighbor + point - f;
        float d = dot(diff, diff);
        minDist = min(minDist, d);
      }
    }
    return sqrt(minDist);
  }

  // FBM (Fractional Brownian Motion)
  float fbm(vec2 uv) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    float lacunarity = 2.1;
    float gain = 0.55;
    for (int i = 0; i < 5; i++) {
      value += amplitude * perlin2D(uv * frequency);
      frequency *= lacunarity;
      amplitude *= gain;
    }
    return value / 2.0;
  }
`;

const dustVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const dustFragmentShader = /* glsl */ `
  ${noiseGLSL}
  varying vec2 vUv;
  varying vec3 vWorldPos;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uScale;

  void main() {
    vec2 coord = vUv * uScale;

    // 混合 Perlin FBM + Worley
    float f = fbm(coord);
    float w = 1.0 - worley2D(coord * 1.8);
    float n = f * 0.7 + w * 0.3;

    // 边缘柔化
    float edge = 1.0 - smoothstep(0.35, 0.6, length(vUv - 0.5) * 2.0);

    float alpha = n * edge * uOpacity;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(uColor, alpha);
  }
`;

function DustPlane({ pos, rot, scale, color, opacity, noiseScale }) {
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uOpacity: { value: opacity },
    uScale: { value: noiseScale },
  }), [color, opacity, noiseScale]);

  const quat = useMemo(() => {
    const euler = new THREE.Euler(rot[0], rot[1], rot[2]);
    return new THREE.Quaternion().setFromEuler(euler);
  }, [rot]);

  return (
    <mesh position={pos} quaternion={quat} scale={scale} renderOrder={3}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={dustVertexShader}
        fragmentShader={dustFragmentShader}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

const DUST_LAYERS = [
  // 银河盘面上方大尺度尘埃
  { pos: [0, 25000, 0],      rot: [Math.PI / 2, 0, 0], scale: 180000, color: '#2a2d3a', opacity: 0.020, noiseScale: 3.0 },
  { pos: [0, -20000, 0],     rot: [Math.PI / 2, 0, 0], scale: 160000, color: '#25283a', opacity: 0.018, noiseScale: 3.5 },
  // 倾斜切面
  { pos: [40000, 15000, 30000],  rot: [1.2, 0.5, 0.3], scale: 140000, color: '#2a2838', opacity: 0.015, noiseScale: 4.0 },
  { pos: [-40000, -12000, -30000], rot: [0.8, -0.4, -0.2], scale: 150000, color: '#282a38', opacity: 0.015, noiseScale: 4.5 },
  { pos: [20000, -28000, -40000], rot: [0.6, 0.7, 0.1], scale: 120000, color: '#262838', opacity: 0.012, noiseScale: 5.0 },
  { pos: [-30000, 22000, 35000], rot: [1.5, -0.3, 0.4], scale: 130000, color: '#28263a', opacity: 0.012, noiseScale: 5.5 },
];

export default function CosmicDust() {
  return (
    <group>
      {DUST_LAYERS.map((layer, i) => (
        <DustPlane key={i} {...layer} />
      ))}
    </group>
  );
}
