import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SCALE = { xingyu: 1.0, shangjie: 0.55, fanjie: 0.45, xiajie: 0.4 };

const RUNE_VS = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const RUNE_FS = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;
  void main() {
    float seg = fract(vUv.x * 18.0 + uTime * 0.03);
    float longRune = smoothstep(0.0, 0.05, seg) * smoothstep(0.24, 0.19, seg);
    float dotRune = smoothstep(0.42, 0.45, seg) * smoothstep(0.53, 0.50, seg);
    float twinA = smoothstep(0.60, 0.62, seg) * smoothstep(0.68, 0.66, seg);
    float twinB = smoothstep(0.70, 0.72, seg) * smoothstep(0.78, 0.76, seg);
    float rune = max(max(longRune, dotRune * 0.5), max(twinA * 0.45, twinB * 0.45));
    float edge = 1.0 - abs(vUv.y - 0.5) * 2.0;
    edge = pow(edge, 3.0) * 0.04;
    float alpha = rune * 0.8 + edge;
    vec3 col = uColor * (0.15 + rune * 0.85);
    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`;

function RuneRing({ radius, tube, color, plane }) {
  const meshRef = useRef();
  const { uniforms } = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
    },
  }), [color]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation[plane === 'xz' ? 'x' : 'y'] += 0.005;
    }
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  const ring = (
    <mesh ref={meshRef}>
      <torusGeometry args={[radius, tube, 24, 140]} />
      <shaderMaterial
        vertexShader={RUNE_VS}
        fragmentShader={RUNE_FS}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );

  if (plane === 'xz') {
    return <group rotation={[Math.PI / 2, 0, 0]}>{ring}</group>;
  }
  return ring;
}

export default function SelectedNodeRunes({ position, color, type }) {
  const s = SCALE[type] || 0.45;

  return (
    <group position={[position.x, position.y, position.z]}>
      <RuneRing radius={0.7 * s} tube={0.022 * s} color={color} plane="xy" />
      <RuneRing radius={0.7 * s} tube={0.022 * s} color={color} plane="xz" />
    </group>
  );
}
