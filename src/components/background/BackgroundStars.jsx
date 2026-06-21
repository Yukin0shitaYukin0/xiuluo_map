import { useMemo } from 'react';
import * as THREE from 'three';
import ParallaxGroup from './ParallaxGroup';

// 确定性 RNG
function rng(s) {
  const n = Math.sin(s * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
}

// 均匀球面分布
function spherePoint(radius, seed) {
  const theta = rng(seed) * Math.PI * 2;
  const phi = Math.acos(2 * rng(seed + 0.5) - 1);
  return {
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.sin(phi) * Math.sin(theta),
    z: radius * Math.cos(phi),
  };
}

// 星点颜色：95% 白 / 3% 蓝白 / 1% 金黄 / 1% 红
function starColor(seed) {
  const r = rng(seed);
  if (r < 0.95) return [1, 1, 1];
  if (r < 0.98) return [0.65, 0.78, 1];
  if (r < 0.99) return [1, 0.82, 0.45];
  return [1, 0.28, 0.18];
}

// 锐利微小点纹理（无光晕，Sub-Pixel Rendering）
let _dotTexture = null;
function getDotTexture() {
  if (_dotTexture) return _dotTexture;
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const half = size / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.06, 'rgba(255,255,255,1)');
  grad.addColorStop(0.15, 'rgba(255,255,255,0.7)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.15)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  _dotTexture = tex;
  return tex;
}

// 景深层配置
const LAYERS = [
  { dist: 20000,  count: 5000,  size: 20,  opacity: 0.10, speed: 1.0 },
  { dist: 50000,  count: 10000, size: 24,  opacity: 0.06, speed: 0.6 },
  { dist: 100000, count: 25000, size: 34,  opacity: 0.04, speed: 0.3 },
  { dist: 300000, count: 40000, size: 55,  opacity: 0.025, speed: 0.1 },
];

function StarShell({ distance, count, size, opacity }) {
  const { positions, colors } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const pt = spherePoint(distance, i * 1.618 + distance * 0.001);
      p[i * 3] = pt.x;
      p[i * 3 + 1] = pt.y;
      p[i * 3 + 2] = pt.z;
      const col = starColor(i * 2.718 + distance);
      c[i * 3] = col[0];
      c[i * 3 + 1] = col[1];
      c[i * 3 + 2] = col[2];
    }
    return { positions: p, colors: c };
  }, [distance, count]);

  const dotTex = useMemo(() => getDotTexture(), []);

  return (
    <points renderOrder={1}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        map={dotTex}
        vertexColors
        opacity={opacity}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * Layer 2: 超远恒星层 — 4 层景深星点，带视差。
 */
export default function BackgroundStars() {
  return (
    <>
      {LAYERS.map((layer, i) => (
        <ParallaxGroup key={i} speed={layer.speed}>
          <StarShell
            distance={layer.dist}
            count={layer.count}
            size={layer.size}
            opacity={layer.opacity}
          />
        </ParallaxGroup>
      ))}
    </>
  );
}
