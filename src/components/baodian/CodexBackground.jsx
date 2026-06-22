import { useEffect, useRef } from 'react';
import { C } from './codexStyles';

/**
 * 藏经阁背景系统
 * 图层1：CSS 星空（复用现有逻辑，简化版）
 * 图层2：远古阵法纹理
 * 图层3：天河流光
 */

// 生成星光
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function genStars(count, seed, w, h) {
  const rng = seededRandom(seed);
  const shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rng() * w);
    const y = Math.floor(rng() * h);
    const alpha = rng() * 0.4 + 0.3;
    shadows.push(`${x}px ${y}px 0 rgba(200,180,150,${alpha})`);
  }
  return shadows.join(',');
}

let cachedLayers = null;
function getLayers(w, h) {
  if (!cachedLayers) {
    cachedLayers = [
      genStars(120, 7, w || 1920, h || 1080),
      genStars(100, 31, w || 1920, h || 1080),
      genStars(80, 89, w || 1920, h || 1080),
    ];
  }
  return cachedLayers;
}

// ==================== 组件 ====================
export default function CodexBackground() {
  const canvasRef = useRef(null);
  const styleRef = useRef(null);

  // 注入动画关键帧
  useEffect(() => {
    if (styleRef.current) return;
    const el = document.createElement('style');
    el.setAttribute('data-codex-bg', '');
    el.textContent = `
      @keyframes codex-twinkle1 {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.85; }
      }
      @keyframes codex-twinkle2 {
        0%, 100% { opacity: 0.7; }
        33% { opacity: 0.3; }
        66% { opacity: 0.9; }
      }
      @keyframes codex-twinkle3 {
        0%, 100% { opacity: 0.5; }
        45% { opacity: 0.9; }
        75% { opacity: 0.25; }
      }
      @keyframes tianheFlow {
        0% { transform: translateX(-30%) translateY(0); opacity: 0.03; }
        50% { transform: translateX(30%) translateY(5px); opacity: 0.06; }
        100% { transform: translateX(-30%) translateY(0); opacity: 0.03; }
      }
      @keyframes tianheFlow2 {
        0% { transform: translateX(20%) translateY(0); opacity: 0.04; }
        50% { transform: translateX(-25%) translateY(-3px); opacity: 0.07; }
        100% { transform: translateX(20%) translateY(0); opacity: 0.04; }
      }
      .codex-star-layer {
        position: absolute; inset: 0;
        will-change: opacity; pointer-events: none;
      }
      .codex-formation {
        position: absolute; inset: 0; pointer-events: none;
        background-image:
          repeating-conic-gradient(rgba(196,168,106,0.015) 0% 2%,
                                    transparent 2% 10%);
        background-size: 200px 200px;
        mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
        -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
      }
      .codex-formation-ring {
        position: absolute; inset: 0; pointer-events: none;
        border: 1px solid rgba(196,168,106,0.04);
        border-radius: 50%;
        transform: scale(1.5);
        top: -25%; left: -25%; right: -25%; bottom: -25%;
      }
      .tianhe-glow {
        position: absolute; pointer-events: none;
        height: 140px;
        background: radial-gradient(ellipse at center,
          rgba(180,150,100,0.05) 0%, transparent 70%);
        filter: blur(30px);
      }
    `;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => { if (el.parentNode) el.parentNode.removeChild(el); };
  }, []);

  // Canvas 粒子流
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, frameSkip = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = window.innerWidth, h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    };

    let dims = resize();
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * dims.w, y: Math.random() * dims.h,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -(Math.random() * 0.2 + 0.05),
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.4 + 0.15,
    }));

    const handleResize = () => { dims = resize(); };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      frameSkip = (frameSkip + 1) % 2;
      if (frameSkip === 0) {
        ctx.clearRect(0, 0, dims.w, dims.h);
        for (const p of particles) {
          p.x += p.vx; p.y += p.vy;
          if (p.y < -10) { p.y = dims.h + 10; p.x = Math.random() * dims.w; }
          if (p.x < -10) p.x = dims.w + 10;
          if (p.x > dims.w + 10) p.x = -10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,180,150,${p.alpha})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,180,150,${p.alpha * 0.12})`;
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

  const layers = getLayers(1920, 1080);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* 星空 */}
      <div className="codex-star-layer" style={{
        boxShadow: layers[0], animation: 'codex-twinkle1 4s infinite', width: '1px', height: '1px',
      }} />
      <div className="codex-star-layer" style={{
        boxShadow: layers[1], animation: 'codex-twinkle2 5s infinite alternate', width: '1px', height: '1px',
      }} />
      <div className="codex-star-layer" style={{
        boxShadow: layers[2], animation: 'codex-twinkle3 6s infinite alternate-reverse', width: '1px', height: '1px',
      }} />

      {/* 阵纹 */}
      <div className="codex-formation" />
      <div className="codex-formation-ring" />

      {/* 天河流光 */}
      <div className="tianhe-glow" style={{
        top: '12%', left: '-10%', right: '-10%',
        animation: 'tianheFlow 20s infinite ease-in-out',
      }} />
      <div className="tianhe-glow" style={{
        top: '75%', left: '-10%', right: '-10%',
        animation: 'tianheFlow2 25s infinite ease-in-out',
      }} />
      <div className="tianhe-glow" style={{
        top: '45%', left: '-5%', right: '-5%', height: '80px',
        animation: 'tianheFlow 18s infinite ease-in-out alternate',
      }} />

      {/* 粒子 Canvas */}
      <canvas ref={canvasRef}
        style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }} />
    </div>
  );
}
