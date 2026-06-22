import { useEffect, useRef, useCallback } from 'react';
import { C } from './baodianStyles';

const LINK_COLORS = {
  '同盟': '#3dd6c8',
  '敌对': '#ff4a6a',
  '附属': '#d4a855',
  '其他': '#4a5870',
};

const DPR_CAP = 2;

export default function ForceGraph({ nodes, links, width = 600, height = 420, onNodeClick }) {
  const canvasRef = useRef(null);
  const simRef = useRef(null);
  const dragRef = useRef(null);

  const initSim = useCallback((w, h) => {
    const dpr = Math.min(window.devicePixelRatio, DPR_CAP);
    const cw = w * dpr;
    const ch = h * dpr;

    const simNodes = nodes.map((n, i) => ({
      id: n.id,
      name: n.name,
      color: n.color || C.accent,
      x: w / 2 + (Math.random() - 0.5) * w * 0.4,
      y: h / 2 + (Math.random() - 0.5) * h * 0.4,
      vx: 0,
      vy: 0,
      pinned: false,
      radius: 9,
    }));

    const simLinks = links.map((l) => ({
      source: simNodes.find((n) => n.id === l.source),
      target: simNodes.find((n) => n.id === l.target),
      type: l.type || '其他',
    })).filter((l) => l.source && l.target);

    return { nodes: simNodes, links: simLinks, cw, ch, dpr, energy: Infinity, hovered: null, selected: null };
  }, [nodes, links]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio, DPR_CAP);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let sim = initSim(width, height);
    simRef.current = sim;
    let animId;
    let labelFrame = 0;

    // ============ 力模拟 ============
    function tick() {
      const { nodes: sn, links: sl } = sim;
      const repelK = 4000;
      const attractK = 0.008;
      const centerK = 0.002;
      const damping = 0.88;
      const maxVel = 4;

      let totalEnergy = 0;

      // 斥力（全节点对）
      for (let i = 0; i < sn.length; i++) {
        for (let j = i + 1; j < sn.length; j++) {
          const dx = sn[j].x - sn[i].x;
          const dy = sn[j].y - sn[i].y;
          const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          const force = repelK / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          if (!sn[i].pinned) { sn[i].vx -= fx; sn[i].vy -= fy; }
          if (!sn[j].pinned) { sn[j].vx += fx; sn[j].vy += fy; }
        }
      }

      // 引力（连线）
      for (const l of sl) {
        const dx = l.target.x - l.source.x;
        const dy = l.target.y - l.source.y;
        const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        const rest = l.type === '附属' ? 60 : l.type === '同盟' ? 80 : l.type === '敌对' ? 110 : 95;
        const force = attractK * (dist - rest);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        if (!l.source.pinned) { l.source.vx += fx; l.source.vy += fy; }
        if (!l.target.pinned) { l.target.vx -= fx; l.target.vy -= fy; }
      }

      // 中心引力
      for (const n of sn) {
        if (n.pinned) continue;
        const dx = width / 2 - n.x;
        const dy = height / 2 - n.y;
        n.vx += dx * centerK;
        n.vy += dy * centerK;
      }

      // 阻尼 + 限速 + 积分
      for (const n of sn) {
        if (n.pinned) continue;
        n.vx *= damping;
        n.vy *= damping;
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > maxVel) {
          n.vx = (n.vx / speed) * maxVel;
          n.vy = (n.vy / speed) * maxVel;
        }
        n.x += n.vx;
        n.y += n.vy;

        // 边界约束
        n.x = Math.max(15, Math.min(width - 15, n.x));
        n.y = Math.max(15, Math.min(height - 15, n.y));

        totalEnergy += Math.abs(n.vx) + Math.abs(n.vy);
      }

      sim.energy = totalEnergy;
    }

    // ============ 绘制 ============
    function draw() {
      const { nodes: sn, links: sl } = sim;
      ctx.clearRect(0, 0, width, height);

      // 连线
      for (const l of sl) {
        const color = LINK_COLORS[l.type] || LINK_COLORS['其他'];
        const alpha = sim.selected
          ? (l.source === sim.selected || l.target === sim.selected ? 0.9 : 0.12)
          : 0.6;
        const lineW = (l.source === sim.selected || l.target === sim.selected) ? 1.8 : 0.7;

        ctx.beginPath();
        ctx.moveTo(l.source.x, l.source.y);
        ctx.lineTo(l.target.x, l.target.y);
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = lineW;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // 节点
      for (const n of sn) {
        const isHovered = n === sim.hovered;
        const isSelected = n === sim.selected;
        const r = isHovered ? n.radius + 3 : n.radius;

        // 光晕
        if (isHovered || isSelected) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(61,214,200,0.15)' : 'rgba(74,127,196,0.12)';
          ctx.fill();
        }

        // 节点圆
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? C.accentGlow : isHovered ? C.accent : n.color;
        ctx.fill();

        // 内圈
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fill();
      }

      // 标签（每3帧绘制一次）
      labelFrame++;
      if (labelFrame % 2 === 0) {
        ctx.font = '11px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.textAlign = 'center';
        for (const n of sn) {
          const alpha = sim.selected ? (n === sim.selected ? 1 : 0.35) : 0.75;
          ctx.fillStyle = `rgba(200,210,230,${alpha})`;
          ctx.fillText(n.name, n.x, n.y - n.radius - 5);
        }
      }
    }

    // ============ 交互 ============
    function findNode(mx, my) {
      const { nodes: sn } = sim;
      let closest = null;
      let minDist = 16;
      for (const n of sn) {
        const dx = n.x - mx;
        const dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) { minDist = dist; closest = n; }
      }
      return closest;
    }

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      sim.hovered = findNode(mx, my);
      canvas.style.cursor = sim.hovered ? (dragRef.current ? 'grabbing' : 'pointer') : 'default';

      if (dragRef.current && sim.dragNode) {
        sim.dragNode.x = mx;
        sim.dragNode.y = my;
        sim.dragNode.vx = 0;
        sim.dragNode.vy = 0;
      }
    }

    function handleMouseDown(e) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const node = findNode(mx, my);
      if (node) {
        sim.dragNode = node;
        dragRef.current = true;
        node.pinned = true;
      }
    }

    function handleMouseUp(e) {
      if (dragRef.current && sim.dragNode) {
        const dx = Math.abs(sim.dragNode.vx || 0);
        const dy = Math.abs(sim.dragNode.vy || 0);
        // 拖拽距离很小 = click
        if (dx < 0.5 && dy < 0.5) {
          sim.selected = sim.selected === sim.dragNode ? null : sim.dragNode;
          if (onNodeClick && sim.selected) {
            onNodeClick(sim.selected.id);
          }
        }
        sim.dragNode.pinned = false;
        sim.dragNode = null;
        dragRef.current = false;
      }
    }

    function handleMouseLeave() {
      sim.hovered = null;
      sim.dragNode = null;
      dragRef.current = false;
    }

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // ============ 主循环 ============
    const loop = () => {
      if (sim.energy > 0.5 || dragRef.current) {
        tick();
      }
      draw();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [nodes, links, width, height, initSim, onNodeClick]);

  // 数据变更时重置模拟
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    simRef.current = initSim(width, height);
  }, [nodes, links, width, height, initSim]);

  if (!nodes || nodes.length === 0) {
    return (
      <div style={{
        width, height, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.textMuted, fontSize: '13px', fontFamily: 'inherit',
        background: 'rgba(10,18,32,0.4)', borderRadius: '8px',
        border: `1px solid ${C.borderSubtle}`,
      }}>
        暂无势力关系数据
      </div>
    );
  }

  return (
    <canvas ref={canvasRef}
      style={{
        borderRadius: '8px',
        background: 'rgba(10,18,32,0.4)',
        border: `1px solid ${C.borderSubtle}`,
      }} />
  );
}
