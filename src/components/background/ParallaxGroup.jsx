import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 视差深度组 — 根据摄像机位置以不同速度移动，形成深度纵深感。
 * speed=1.0 → 完全跟随相机（近景）
 * speed=0.1 → 几乎不跟随（超远景）
 */
export default function ParallaxGroup({ speed = 1.0, children, ...props }) {
  const ref = useRef();
  const target = useRef(new THREE.Vector3());

  useFrame(({ camera }) => {
    if (!ref.current) return;
    const factor = 1 - speed;
    target.current.set(
      camera.position.x * factor,
      camera.position.y * factor,
      camera.position.z * factor,
    );
    ref.current.position.lerp(target.current, 0.06);
  });

  return (
    <group ref={ref} {...props}>
      {children}
    </group>
  );
}
