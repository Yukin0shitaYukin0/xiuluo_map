import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getRuneFragmentTexture } from '../../data/starTexture';

/**
 * 光屑粒子沿曲线流动。
 * 每个粒子有独立的 phase/speed，循环不止。
 * 到达曲线两端时渐隐，避免突兀的 pop。
 */
export default function ParticleFlow({ curve, color, count = 18, speed = 0.12, brightness = 1 }) {
  const geoRef = useRef();

  const particleData = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        phase: i / count,
        speed: speed * (0.6 + Math.random() * 0.8),
      });
    }
    return arr;
  }, [count, speed]);

  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const pt = curve.getPointAt(particleData[i].phase);
      p[i * 3] = pt.x;
      p[i * 3 + 1] = pt.y;
      p[i * 3 + 2] = pt.z;
    }
    return p;
  }, [curve, count, particleData]);

  const tex = useMemo(() => getRuneFragmentTexture(), []);

  useFrame((state, delta) => {
    if (!geoRef.current) return;
    const dt = Math.min(delta, 0.1);
    const posArr = geoRef.current.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const pd = particleData[i];
      pd.phase = (pd.phase + dt * pd.speed) % 1;
      const pt = curve.getPointAt(pd.phase);
      // 微小垂直漂移，避免完全贴在曲线上
      const drift = Math.sin(state.clock.elapsedTime * 2.2 + pd.phase * 11) * 0.025;
      posArr[i * 3] = pt.x + drift;
      posArr[i * 3 + 1] = pt.y + drift * 0.5;
      posArr[i * 3 + 2] = pt.z + drift;
    }

    geoRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <points renderOrder={4}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        color={color}
        size={0.12}
        blending={THREE.AdditiveBlending}
        depthTest={false}
        depthWrite={false}
        transparent
        opacity={0.65 * brightness}
        sizeAttenuation
      />
    </points>
  );
}
