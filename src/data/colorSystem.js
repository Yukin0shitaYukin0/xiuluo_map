import * as THREE from 'three';

// ==================== 世界等级颜色 ====================
export const SHANGJIE = '#FFD85A';  // 神域金
export const FANJIE   = '#A45CFF';  // 玄灵紫
export const XIAJIE   = '#34FF7A';  // 生命绿

export const PLATINUM  = '#FFF7D6'; // 圣辉白金
export const TAIGU     = '#FFF4D0'; // 太古暖白金

// ==================== 九道天河颜色 ====================
export const TIANHE_COLORS = {
  圣光天河: '#FFD36B',  // 远古金   — 东方
  九魂天河: '#7B5CFF',  // 魂紫     — 东方
  图腾天河: '#27D7FF',  // 图腾蓝   — 北方
  仙海天河: '#00FFCC',  // 仙海青   — 北方
  七界天河: '#FF66C4',  // 界域粉红 — 南方
  神体天河: '#FF4A4A',  // 神血红   — 南方
  苍穹天河: '#4B7FFF',  // 苍穹蓝   — 西方
  血脉天河: '#FF2D7A',  // 血脉猩红 — 西方
};

// ==================== 类型基础色（用于 fallback） ====================
export const TYPE_COLORS = {
  taigu:    TAIGU,
  tianhe:   null,          // 天河用各自专属色
  xingyu:   null,          // 星域 = 天河色 × 神域金
  shangjie: SHANGJIE,
  fanjie:   FANJIE,
  xiajie:   XIAJIE,
};

// ==================== Bloom 发光强度 ====================
export const BLOOM_BOOST = {
  taigu:    2.0,
  tianhe:   3.0,
  xingyu:   1.5,
  shangjie: 0.7,
  fanjie:   0.35,
  xiajie:   0.15,
};

// ==================== 颜色混合函数 ====================
const _tc = new THREE.Color();
const _gc = new THREE.Color();

/** 星域颜色：天河颜色 × 神域金（分量相乘） */
export function mixXingyuColor(tianheHex) {
  _tc.set(tianheHex);
  _gc.set(SHANGJIE);
  return '#' + new THREE.Color(
    _tc.r * _gc.r,
    _tc.g * _gc.g,
    _tc.b * _gc.b,
  ).getHexString();
}

/** 星域霸主色：天河颜色 + 15% 金色 */
export function mixBawangColor(tianheHex) {
  _tc.set(tianheHex);
  _gc.set(SHANGJIE);
  _tc.lerp(_gc, 0.15);
  return '#' + _tc.getHexString();
}

/** 天河霸主色：天河颜色 + 40% 白金 */
export function mixTianheBawang(tianheHex) {
  _tc.set(tianheHex);
  _gc.set(PLATINUM);
  _tc.lerp(_gc, 0.40);
  return '#' + _tc.getHexString();
}

/** 获取节点的实际渲染颜色 */
export function getNodeColor(type, tianheColor) {
  if (type === 'tianhe') return tianheColor || TIANHE_COLORS.圣光天河;
  if (type === 'xingyu') return '#c8c8d0';
  if (TYPE_COLORS[type]) return TYPE_COLORS[type];
  return tianheColor || '#d8c89a';
}
