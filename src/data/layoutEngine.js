import { flattenNodes } from './worldData';

const NUM_TIANHE = 8;
const ANGLE_PER_TIANHE = (Math.PI * 2) / NUM_TIANHE;
const HALF_SECTOR = ANGLE_PER_TIANHE / 2;

// 确定性伪随机 (0..1)
function hashId(id, salt = 0) {
  const s = id + '_' + salt;
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  const n = Math.sin(h * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
}
function signed(id, salt) { return hashId(id, salt) * 2 - 1; }

// Box-Muller 高斯随机数
function gauss(id, salt) {
  const u1 = Math.max(hashId(id, salt), 0.0001);
  const u2 = hashId(id, salt + 0.5);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function computeLayout(worldData) {
  const flatNodes = flattenNodes(worldData);

  const groups = {};
  for (let i = 0; i < NUM_TIANHE; i++) groups[i] = [];
  for (const node of flatNodes) {
    if (node.type === 'taigu') continue;
    if (node.tianheIndex >= 0) groups[node.tianheIndex].push(node);
  }

  const posMap = {};
  posMap['taigu'] = { x: 0, y: 0, z: 0 };

  for (let ti = 0; ti < NUM_TIANHE; ti++) {
    const baseAngle = ti * ANGLE_PER_TIANHE - 1.35;
    const group = groups[ti] || [];

    const tianheNode = group.find(n => n.type === 'tianhe');
    const directKids = group.filter(n => n.depth === 2);
    const depth3plus = group.filter(n => n.depth >= 3);

    // --- 天河节点 (臂中段，距离~28) ---
    if (tianheNode) {
      const id = tianheNode.id;
      const d = 28 + signed(id, 1) * 2;
      const spiral = Math.max(0, d - 5) / 48 * 2.0;
      const a = baseAngle + spiral + signed(id, 2) * 0.03;
      posMap[id] = {
        x: Math.cos(a) * d,
        y: signed(id, 3) * 1.5,
        z: Math.sin(a) * d,
      };
    }

    // --- 直接子节点 ---
    const TAIL_IDS = new Set(['sg_zuwu_xingyu', 'sg_zhutian']);
    const MID_IDS = new Set(['sg_tuteng_xingyu']);
    const regularKids = directKids.filter(k => !TAIL_IDS.has(k.id) && !MID_IDS.has(k.id));
    const tailKids = directKids.filter(k => TAIL_IDS.has(k.id));
    const midKids = directKids.filter(k => MID_IDS.has(k.id));

    // 按确定性哈希排序，产生自然的先后次序
    const sorted = [...regularKids].sort((a, b) => hashId(a.id, 0) - hashId(b.id, 0));

    for (let i = 0; i < sorted.length; i++) {
      const child = sorted[i];
      const id = child.id;

      // 沿臂位置 t (0≈近核, 1≈远梢)
      const t = (i + 0.5) / sorted.length;

      // 径向距离: 14→34（臂中段，尾巴之前），±12%随机抖动
      const baseDist = 14 + t * 20;
      const dist = baseDist + baseDist * signed(id, 10) * 0.15;

      // 角度: 螺线与 ArmTrace 对齐 (total ~0.3 rad over 48 units)
      const spiral = Math.max(0, dist - 5) / 48 * 2.0;
      const jitter = signed(id, 11) * 0.04;
      const a = baseAngle + spiral + jitter;

      // Y 高度: 微立体，同臂节点略有起伏
      const y = signed(id, 12) * 1.8 + Math.sin(t * Math.PI) * 0.8;

      posMap[id] = { x: Math.cos(a) * dist, y, z: Math.sin(a) * dist };
    }

    // --- 中间星域 (臂中段，~24) ---
    for (const child of midKids) {
      const id = child.id;
      const t = 0.5;
      const dist = 14 + t * 20 + signed(id, 10) * 2;
      const spiral = Math.max(0, dist - 5) / 48 * 2.0;
      const a = baseAngle + spiral + signed(id, 11) * 0.03;
      const y = signed(id, 12) * 1.2;
      posMap[id] = { x: Math.cos(a) * dist, y, z: Math.sin(a) * dist };
    }

    // --- 尾巴星域 (臂梢，42→48) ---
    for (let i = 0; i < tailKids.length; i++) {
      const child = tailKids[i];
      const id = child.id;
      const dist = 44 + signed(id, 20) * 4;
      const spiral = Math.max(0, dist - 5) / 48 * 2.0;
      const a = baseAngle + spiral + signed(id, 21) * 0.04;
      posMap[id] = {
        x: Math.cos(a) * dist,
        y: signed(id, 22) * 2,
        z: Math.sin(a) * dist,
      };
    }

    // --- 深度 ≥3 子节点：围绕父星域 ---
    const xingyuKids = {};
    for (const node of depth3plus) {
      const p = node.parentXingyu || '__orphan__';
      if (!xingyuKids[p]) xingyuKids[p] = [];
      xingyuKids[p].push(node);
    }

    for (const [parentName, kids] of Object.entries(xingyuKids)) {
      let cx, cy, cz;
      const pp = posMap[parentName];
      if (pp) {
        ({ x: cx, y: cy, z: cz } = pp);
      } else {
        const idx = directKids.findIndex(k => k.name === parentName);
        const d = 14 + (idx >= 0 ? idx : directKids.length) * 2.6;
        const fbSpiral = Math.max(0, d - 5) / 48 * 2.0;
        cx = Math.cos(baseAngle + fbSpiral) * d;
        cz = Math.sin(baseAngle + fbSpiral) * d;
        cy = 0;
      }

      const n = kids.length;
      // 高斯分布 sigma：按类型微调
      const sigmaMap = { shangjie: 1.2, fanjie: 1.5, xiajie: 1.8 };
      for (let ki = 0; ki < n; ki++) {
        const kid = kids[ki];
        const id = kid.id;
        const sigma = (sigmaMap[kid.type] || 1.5) * (0.7 + kid.depth * 0.15);
        posMap[id] = {
          x: cx + gauss(id, 30) * sigma,
          y: cy + gauss(id, 31) * sigma,
          z: cz + gauss(id, 32) * sigma,
        };
      }
    }
  }

  // 手动微调
  const Y_ADJUST = { tianyu: 2.5 };
  for (const [id, dy] of Object.entries(Y_ADJUST)) {
    if (posMap[id]) posMap[id].y += dy;
  }

  const RADIAL_SCALE = { xianquan: 1.5, sg_feiyun: 1.4 };
  for (const [id, scale] of Object.entries(RADIAL_SCALE)) {
    if (posMap[id]) {
      posMap[id].x *= scale;
      posMap[id].z *= scale;
    }
  }

  // 相对位置覆盖：下界放在百炼凡界下方
  if (posMap['sg_bailian']) {
    const bp = posMap['sg_bailian'];
    if (posMap['sg_zuwu_xiajie']) {
      posMap['sg_zuwu_xiajie'] = { x: bp.x - 0.5, y: bp.y + 1.5, z: bp.z };
    }
    if (posMap['sg_huiye']) {
      posMap['sg_huiye'] = { x: bp.x + 0.5, y: bp.y + 1.5, z: bp.z };
    }
  }

  return posMap;
}
