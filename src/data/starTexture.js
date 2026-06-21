import * as THREE from 'three';

let _texture = null;

export function getStarTexture() {
  if (_texture) return _texture;

  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Sharp bright core
  const core = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 0.10);
  core.addColorStop(0,    'rgba(255,255,255,1)');
  core.addColorStop(0.2,  'rgba(255,255,255,1)');
  core.addColorStop(0.5,  'rgba(255,250,235,0.7)');
  core.addColorStop(0.8,  'rgba(255,220,160,0.2)');
  core.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = core;
  ctx.fillRect(0, 0, size, size);

  // Soft wide glow
  const glow = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  glow.addColorStop(0,    'rgba(255,250,240,0)');
  glow.addColorStop(0.12, 'rgba(255,240,210,0.4)');
  glow.addColorStop(0.30, 'rgba(255,220,160,0.18)');
  glow.addColorStop(0.55, 'rgba(200,160,100,0.05)');
  glow.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  _texture = texture;
  return texture;
}

// ---- 光屑纹理（非圆形长椭圆碎片） ----
let _runeTexture = null;

export function getRuneFragmentTexture() {
  if (_runeTexture) return _runeTexture;

  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const half = size / 2;

  ctx.save();
  ctx.translate(half, half);
  // 长椭圆 3:1，非圆形
  ctx.scale(1, 0.35);

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, half * 0.85);
  grad.addColorStop(0,    'rgba(255,255,255,1)');
  grad.addColorStop(0.08, 'rgba(255,250,235,0.9)');
  grad.addColorStop(0.22, 'rgba(255,235,200,0.55)');
  grad.addColorStop(0.45, 'rgba(255,200,140,0.15)');
  grad.addColorStop(0.7,  'rgba(180,130,80,0.03)');
  grad.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(-half, -half, size, size);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  _runeTexture = texture;
  return texture;
}
