import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NOISE_GLSL } from '../../shaders/noise';

const vert = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vViewPos;
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewPos = -mvPos.xyz;
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const frag = /* glsl */ `
  ${NOISE_GLSL}
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uBrightness;
  varying vec3 vWorldPos;
  varying vec3 vViewPos;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vec3 noiseCoord = vWorldPos * 3.5 + uTime * 0.05;
    float n = fbm(noiseCoord);

    vec3 vd = normalize(vViewPos);
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vd)), 2.5);

    vec3 col = uColor * (0.75 + n * 0.35);
    col *= (1.0 - fresnel * 0.6);

    float grain = (hash3D(vWorldPos * 80.0) - 0.5) * 0.06;
    col += grain;
    col *= uBrightness;

    float pulse = 1.0 + sin(uTime * 1.7 + vUv.y * 6.28) * 0.04;
    col *= pulse;

    float alpha = 0.85 + n * 0.15;
    gl_FragColor = vec4(col, alpha);
  }
`;

export default function CoreLine({ curve, color, brightness }) {
  const meshRef = useRef();
  const curBright = useRef(brightness);

  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uTime: { value: 0 },
    uBrightness: { value: brightness },
  }), [color]);

  const tubeGeo = useMemo(() =>
    new THREE.TubeGeometry(curve, 32, 0.004, 6, false),
  [curve]);

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    curBright.current += (brightness - curBright.current) * Math.min(1, delta * 5);
    uniforms.uBrightness.value = curBright.current;
  });

  return (
    <mesh ref={meshRef} geometry={tubeGeo} renderOrder={3}>
      <shaderMaterial
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthTest={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
