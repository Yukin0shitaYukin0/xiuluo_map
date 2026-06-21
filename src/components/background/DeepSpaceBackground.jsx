import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec3 vWorldNormal;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vWorldNormal;

  void main() {
    float t = abs(normalize(vWorldNormal).y);
    float grad = smoothstep(0.0, 0.55, t);

    vec3 innerCol = vec3(0.012, 0.010, 0.018); // ~#030412
    vec3 midCol   = vec3(0.008, 0.010, 0.022); // ~#02030a
    vec3 outerCol = vec3(0.005, 0.008, 0.020); // ~#010205

    vec3 col = mix(innerCol, midCol, smoothstep(0.0, 0.35, grad));
    col = mix(col, outerCol, smoothstep(0.35, 1.0, grad));

    gl_FragColor = vec4(col, 1.0);
  }
`;

/**
 * Layer 1: 深空背景 — 天空球体，盘面略亮、两极渐暗。
 * 跟随摄像机移动，始终填满屏幕。
 */
export default function DeepSpaceBackground() {
  const ref = useRef();

  useFrame(({ camera }) => {
    if (ref.current) {
      ref.current.position.copy(camera.position);
    }
  });

  return (
    <mesh ref={ref} scale={[100000, 100000, 100000]} renderOrder={0}>
      <sphereGeometry args={[1, 48, 48]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.BackSide}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
