import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NOISE_GLSL } from '../../shaders/noise';

const vert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  ${NOISE_GLSL}
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uBrightness;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    float t = fract(vUv.y * 5.0 - uTime * uSpeed);

    float warp = fbm(vec3(vUv.y * 4.0, vUv.x * 3.0, uTime * 0.15)) * 0.25;
    float streak = smoothstep(0.0, 0.35 + warp, t)
                 * smoothstep(0.65 + warp, 0.4, t);

    float cross = 1.0 - abs(vUv.x - 0.5) * 2.0;
    cross = pow(cross, 1.2);

    float alpha = streak * cross * 0.30 * uBrightness;
    alpha = clamp(alpha, 0.0, 1.0);

    vec3 col = uColor * (0.6 + streak * 0.4);

    gl_FragColor = vec4(col, alpha);
  }
`;

export default function EnergyFlow({ curve, color, brightness, speed = 0.15 }) {
  const meshRef = useRef();
  const curBright = useRef(brightness);

  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uTime: { value: 0 },
    uSpeed: { value: speed },
    uBrightness: { value: brightness },
  }), [color, speed]);

  const tubeGeo = useMemo(() =>
    new THREE.TubeGeometry(curve, 24, 0.06, 6, false),
  [curve]);

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    curBright.current += (brightness - curBright.current) * Math.min(1, delta * 5);
    uniforms.uBrightness.value = curBright.current;
  });

  return (
    <mesh ref={meshRef} geometry={tubeGeo} renderOrder={2}>
      <shaderMaterial
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
