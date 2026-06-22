import { useEffect, useRef, useMemo } from 'react';
import { C } from './baodianStyles';

const STAR_COUNT = 140;
const PARTICLE_COUNT = 100;

/** 生成 CSS box-shadow 星光字符串（种子随机，保证每次渲染一致） */
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function generateStarShadows(count, seed, maxW, maxH) {
  const rng = seededRandom(seed);
  const shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rng() * maxW);
    const y = Math.floor(rng() * maxH);
    const size = rng() * 2 + 0.5;
    const alpha = rng() * 0.5 + 0.4;
    const hue = rng() < 0.05 ? 40 : rng() < 0.08 ? 200 : 0;
    const sat = hue === 0 ? 0 : 60;
    shadows.push(`${x}px ${y}px ${size}px hsla(${hue},${sat}%,80%,${alpha})`);
  }
  return shadows.join(',');
}

// 预生成星光阴影
let cachedStars = null;
function getStarLayers(w, h) {
  if (!cachedStars) {
    cachedStars = [
      generateStarShadows(STAR_COUNT, 42, w || 1920, h || 1080),
      generateStarShadows(STAR_COUNT, 137, w || 1920, h || 1080),
      generateStarShadows(STAR_COUNT, 251, w || 1920, h || 1080),
    ];
  }
  return cachedStars;
}

// ==================== 粒子类型 ====================
function createParticles(w, h) {
  const ps = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    ps.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(Math.random() * 0.25 + 0.08),
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
      hue: Math.random() < 0.6 ? 210 : Math.random() < 0.8 ? 175 : 40,
    });
  }
  return ps;
}

// ==================== 组件 ====================
export default function StarfieldBackground() {
  const canvasRef = useRef(null);
  const styleRef = useRef(null);
  const starsRef = useRef(null);

  // 注入闪烁关键帧（仅一次）
  useEffect(() => {
    if (styleRef.current) return;
    const el = document.createElement('style');
    el.setAttribute('data-baodian-stars', '');
    el.textContent = `
      @keyframes bd-twinkle1 {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
      @keyframes bd-twinkle2 {
        0%, 100% { opacity: 0.8; }
        30% { opacity: 0.3; }
        70% { opacity: 1; }
      }
      @keyframes bd-twinkle3 {
        0%, 100% { opacity: 0.6; }
        40% { opacity: 1; }
        80% { opacity: 0.25; }
      }
      .bd-star-layer {
        position: absolute;
        inset: 0;
        will-change: opacity;
        pointer-events: none;
      }
    `;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);

  // Canvas 粒子动画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let frameSkip = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    };

    let dims = resize();
    let particles = createParticles(dims.w, dims.h);
    starsRef.current = getStarLayers(dims.w, dims.h);

    const handleResize = () => {
      dims = resize();
      particles = createParticles(dims.w, dims.h);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      frameSkip = (frameSkip + 1) % 2;
      if (frameSkip === 0) {
        ctx.clearRect(0, 0, dims.w, dims.h);

        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.y < -10) { p.y = dims.h + 10; p.x = Math.random() * dims.w; }
          if (p.x < -10) p.x = dims.w + 10;
          if (p.x > dims.w + 10) p.x = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue},50%,70%,${p.alpha})`;
          ctx.fill();

          // 微光晕
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue},50%,70%,${p.alpha * 0.15})`;
          ctx.fill();
        }
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const starLayers = starsRef.current || getStarLayers(1920, 1080);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      overflow: 'hidden',
    }}>
      {/* CSS 星光层 */}
      <div className="bd-star-layer" style={{
        boxShadow: starLayers[0],
        animation: 'bd-twinkle1 3.5s infinite',
        width: '1px', height: '1px',
      }} />
      <div className="bd-star-layer" style={{
        boxShadow: starLayers[1],
        animation: 'bd-twinkle2 4.5s infinite alternate',
        width: '1px', height: '1px',
      }} />
      <div className="bd-star-layer" style={{
        boxShadow: starLayers[2],
        animation: 'bd-twinkle3 5.5s infinite alternate-reverse',
        width: '1px', height: '1px',
      }} />
      {/* Canvas 粒子流 */}
      <canvas ref={canvasRef}
        style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }} />
    </div>
  );
}
