import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const LERP = 3.0;

export default function OrbitTargetController({ targetId, positions }) {
  const { camera, controls } = useThree();
  const current = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3());
  const offset = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!controls) return;

    if (targetId && positions[targetId]) {
      const p = positions[targetId];
      desired.current.set(p.x, p.y, p.z);
    } else {
      desired.current.set(0, 0, 0);
    }

    // 记录 camera 相对当前 target 的偏移
    offset.current.copy(camera.position).sub(controls.target);
  }, [targetId, positions, camera, controls]);

  useFrame((_, delta) => {
    if (!controls) return;

    current.current.lerp(desired.current, Math.min(1, delta * LERP));
    controls.target.copy(current.current);

    // 保持相机相对 target 的偏移不变，这样视角不会因 target 移动而转向
    camera.position.copy(current.current).add(offset.current);
  });

  return null;
}
