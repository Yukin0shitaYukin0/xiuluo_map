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
  uniform float uOpacity;
  uniform float uBrightness;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    float d = abs(vUv.x - 0.5) * 2.0;
    float sigma = 0.4;
    float glow = exp(-d * d / (2.0 * sigma * sigma));

    float n = noise3D(vWorldPos * 1.5) * 0.15;
    glow += n;
    glow = clamp(glow, 0.0, 1.0);

    float wisp = fbm(vec3(vUv.y * 3.0, 0.0, 0.0)) * 0.2;

    float alpha = glow * uOpacity * uBrightness * (1.0 + wisp);
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(uColor, alpha);
  }
`;

export default function OuterGlow({ curve, color, brightness, opacity = 0.18 }) {
  const meshRef = useRef();
  const curBright = useRef(brightness);

  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uOpacity: { value: opacity },
    uBrightness: { value: brightness },
  }), [color, opacity]);

  const tubeGeo = useMemo(() =>
    new THREE.TubeGeometry(curve, 12, 0.05, 4, false),
  [curve]);

  useFrame((_, delta) => {
    curBright.current += (brightness - curBright.current) * Math.min(1, delta * 5);
    uniforms.uBrightness.value = curBright.current;
  });

  return (
    <mesh ref={meshRef} geometry={tubeGeo} renderOrder={1}>
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
