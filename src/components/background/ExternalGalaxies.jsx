import { useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

const GALAXY_COUNT = 200;
const SHELL_INNER = 180000;
const SHELL_OUTER = 350000;

function rng(s) {
  const n = Math.sin(s * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function spherePoint(seed) {
  const theta = rng(seed) * Math.PI * 2;
  const phi = Math.acos(2 * rng(seed + 0.5) - 1);
  const r = SHELL_INNER + rng(seed + 1) * (SHELL_OUTER - SHELL_INNER);
  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.sin(phi) * Math.sin(theta),
    z: r * Math.cos(phi),
  };
}

// ---- 程序化星系纹理 (128×128) ----
function createEllipticalTexture(salt) {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  const half = size / 2;
  ctx.save();
  ctx.translate(half, half);
  const aspect = 0.3 + rng(salt) * 0.5;
  ctx.scale(1, aspect);
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, half * 0.9);
  grad.addColorStop(0, 'rgba(255,255,255,0.9)');
  grad.addColorStop(0.08, 'rgba(255,250,240,0.7)');
  grad.addColorStop(0.25, 'rgba(220,210,190,0.35)');
  grad.addColorStop(0.5, 'rgba(150,140,130,0.1)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(-half, -half, size, size);
  ctx.restore();
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function createSpiralTexture(salt) {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  const half = size / 2;

  const coreGrad = ctx.createRadialGradient(half, half, 0, half, half, half * 0.12);
  coreGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
  coreGrad.addColorStop(0.5, 'rgba(255,245,220,0.5)');
  coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = coreGrad;
  ctx.fillRect(0, 0, size, size);

  const arms = 2 + Math.floor(rng(salt + 10) * 3);
  const armAngle = (Math.PI * 2) / arms;
  const twist = 2.5 + rng(salt + 20) * 3;

  for (let a = 0; a < arms; a++) {
    const baseA = a * armAngle + rng(salt + 30 + a) * 0.3;
    for (let i = 0; i < 3000; i++) {
      const t = Math.pow(rng(a * 1000 + i + salt), 0.7);
      const r = t * half * 0.95;
      const angle = baseA + t * twist;
      const spread = (1 - t) * half * 0.02 + t * half * 0.06;
      const sx = half + Math.cos(angle) * r + (rng(a * 1000 + i + 0.3) - 0.5) * spread * 2;
      const sy = half + Math.sin(angle) * r + (rng(a * 1000 + i + 0.6) - 0.5) * spread * 2;
      const alpha = 0.15 + (1 - t) * 0.55;
      ctx.fillStyle = `rgba(200,190,255,${alpha})`;
      ctx.fillRect(sx, sy, 1.2, 1.2);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function createIrregularTexture(salt) {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  const half = size / 2;

  const numBlobs = 5 + Math.floor(rng(salt) * 15);
  for (let i = 0; i < numBlobs; i++) {
    const bx = half * 0.3 + rng(i * 1.7 + salt) * half * 1.4;
    const by = half * 0.3 + rng(i * 2.3 + salt) * half * 1.4;
    const br = half * 0.05 + rng(i * 3.1 + salt) * half * 0.3;
    const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    const alpha = 0.05 + rng(i * 4.1 + salt) * 0.2;
    grad.addColorStop(0, `rgba(200,195,210,${alpha})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  for (let i = 0; i < 100; i++) {
    const sx = rng(i * 5.5 + salt) * size;
    const sy = rng(i * 6.1 + salt) * size;
    ctx.fillStyle = `rgba(200,200,220,${0.08 + rng(i * 7 + salt) * 0.15})`;
    ctx.fillRect(sx, sy, 1, 1);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function createTextures() {
  const textures = [];
  for (let i = 0; i < 4; i++) textures.push(createEllipticalTexture(i * 100));
  for (let i = 0; i < 4; i++) textures.push(createSpiralTexture(i * 100 + 50));
  for (let i = 0; i < 2; i++) textures.push(createIrregularTexture(i * 100 + 80));
  return textures;
}

export default function ExternalGalaxies() {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);

  const data = useMemo(() => {
    if (!ready) return [];
    const textures = createTextures();
    const galaxies = [];
    for (let i = 0; i < GALAXY_COUNT; i++) {
      const pos = spherePoint(i * 3.141);
      const texIdx = Math.floor(rng(i * 2.718) * textures.length);
      const rot = rng(i * 1.414) * Math.PI * 2;
      // 在远距离下需要更大的精灵尺寸才能可见
      const scale = 4000 + rng(i * 1.732) * 16000;

      const tintChoice = rng(i * 2.236);
      let tint;
      if (tintChoice < 0.5) tint = new THREE.Color().setHSL(0.62, 0.04, 0.55 + rng(i * 3) * 0.35);
      else if (tintChoice < 0.8) tint = new THREE.Color().setHSL(0.58, 0.06, 0.58 + rng(i * 4) * 0.3);
      else tint = new THREE.Color().setHSL(0.12, 0.08, 0.66 + rng(i * 5) * 0.25);

      const opacity = 0.05 + rng(i * 1.618) * 0.10;

      galaxies.push({
        key: i,
        position: [pos.x, pos.y, pos.z],
        texture: textures[texIdx],
        rotation: rot,
        scale: [scale, scale * (0.3 + rng(i * 5.5) * 0.7), 1],
        color: tint,
        opacity,
      });
    }
    return galaxies;
  }, [ready]);

  if (!ready) return null;

  return (
    <group renderOrder={2}>
      {data.map((g) => (
        <sprite
          key={g.key}
          position={g.position}
          scale={g.scale}
          renderOrder={2}
        >
          <spriteMaterial
            map={g.texture}
            color={g.color}
            opacity={g.opacity}
            transparent
            depthTest={false}
            depthWrite={false}
            blending={THREE.NormalBlending}
            rotation={g.rotation}
          />
        </sprite>
      ))}
    </group>
  );
}
