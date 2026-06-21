import { useMemo } from 'react';
import * as THREE from 'three';

const nebulaVertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec3 vViewDir;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const nebulaFragmentShader = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec3 vViewDir;

  uniform vec3 uColor;
  uniform float uOpacity;

  // 简易 3D Worley-FBM 用于体积感
  float hash3D(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  float worley3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    float minDist = 1.0;
    for (int x = -1; x <= 1; x++) {
      for (int y = -1; y <= 1; y++) {
        for (int z = -1; z <= 1; z++) {
          vec3 neighbor = vec3(float(x), float(y), float(z));
          vec3 point = vec3(
            hash3D(i + neighbor),
            hash3D(i + neighbor + vec3(100, 0, 0)),
            hash3D(i + neighbor + vec3(0, 100, 0))
          );
          vec3 diff = neighbor + point - f;
          float d = dot(diff, diff);
          minDist = min(minDist, d);
        }
      }
    }
    return sqrt(minDist);
  }

  float fbm3D(vec3 p) {
    float value = 0.0;
    float amp = 1.0;
    float freq = 1.0;
    for (int i = 0; i < 4; i++) {
      value += amp * worley3D(p * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return value;
  }

  void main() {
    // 基于世界坐标计算噪声
    float n = fbm3D(vWorldPos * 0.0003);

    // 球面边缘衰减（软边界，避免硬边）
    float fresnel = abs(dot(normalize(vWorldNormal), normalize(vViewDir)));
    float edgeFade = 1.0 - pow(fresnel, 2.5);

    // 内部结构：噪声调制
    float density = n * 0.7 + 0.3;
    density *= edgeFade;

    // 多层透明度叠加
    float alpha = density * uOpacity;
    alpha = clamp(alpha, 0.0, 1.0);
    alpha *= alpha; // 非线性映射，让边缘更透明

    gl_FragColor = vec4(uColor, alpha);
  }
`;

function NebulaCloud({ position, radius, color, opacity }) {
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uOpacity: { value: opacity },
  }), [color, opacity]);

  return (
    <mesh position={position} scale={[radius, radius, radius]} renderOrder={4}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

// 星云只出现在银河外围（距离 > 50000），不在银河盘面附近
const NEBULAE = [
  { pos: [70000, 30000, 60000],   r: 3500, color: '#2a3058', opacity: 0.025 },
  { pos: [-65000, -25000, -55000], r: 4000, color: '#2a2850', opacity: 0.02 },
  { pos: [55000, -35000, 45000],   r: 3000, color: '#283050', opacity: 0.022 },
  { pos: [-70000, 28000, -50000],  r: 3800, color: '#302a50', opacity: 0.02 },
  { pos: [80000, 15000, -40000],   r: 4500, color: '#282a48', opacity: 0.018 },
  { pos: [-55000, -20000, 65000],  r: 3200, color: '#2a2848', opacity: 0.025 },
  { pos: [40000, 40000, -60000],   r: 5000, color: '#283048', opacity: 0.015 },
  { pos: [-75000, 35000, 35000],   r: 2800, color: '#2a3050', opacity: 0.022 },
  { pos: [65000, -40000, -30000],  r: 3500, color: '#302a48', opacity: 0.02 },
  { pos: [-45000, -35000, 70000],  r: 4200, color: '#282a50', opacity: 0.018 },
  { pos: [50000, 35000, -70000],   r: 3000, color: '#2a2848', opacity: 0.022 },
  { pos: [-80000, -15000, 45000],  r: 3800, color: '#283050', opacity: 0.02 },
];

export default function DistantNebulae() {
  return (
    <group>
      {NEBULAE.map((n, i) => (
        <NebulaCloud key={i} position={n.pos} radius={n.r} color={n.color} opacity={n.opacity} />
      ))}
    </group>
  );
}
