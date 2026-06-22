/**
 * 宝典共享样式系统 — 宇宙星空主题色板与样式工厂
 */

// ==================== 色板 ====================
export const C = {
  bgDeepest: '#040810',
  bgDeep: '#0a1220',
  bgMid: '#111d33',
  accent: '#4a7fc4',
  accentGlow: '#3dd6c8',
  accentGold: '#d4a855',
  textPrimary: '#e8ecf4',
  textSecondary: '#8898b8',
  textMuted: '#4a5870',
  borderSubtle: 'rgba(74,127,196,0.10)',
  borderActive: 'rgba(74,127,196,0.35)',
  borderGlow: 'rgba(61,214,200,0.25)',
  danger: '#ff4a6a',
};

// ==================== 字体 ====================
export const FONT = '"Noto Serif SC", "SimSun", "STSong", serif';
export const FONT_SANS = '"PingFang SC", "Microsoft YaHei", sans-serif';

// ==================== 转场 ====================
export const TRANS = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';

// ==================== 样式工厂 ====================

/** 玻璃质感卡片底面 */
export const glassPanel = (opacity = 0.6) => ({
  background: `rgba(10,18,32,${opacity})`,
  border: `1px solid ${C.borderSubtle}`,
  borderRadius: '8px',
  backdropFilter: 'blur(8px)',
});

/** 辉光边框（活跃状态） */
export const glowBorder = (active) => ({
  border: active ? `1px solid ${C.borderActive}` : `1px solid ${C.borderSubtle}`,
  boxShadow: active ? `0 0 12px ${C.borderGlow}, inset 0 0 6px rgba(61,214,200,0.06)` : 'none',
  transition: TRANS,
});

/** 文字渐变 */
export const textGradient = (from = C.accent, to = C.accentGold) => ({
  background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

/** 统计卡片 */
export const statCard = () => ({
  ...glassPanel(0.5),
  padding: '20px 16px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: TRANS,
  minWidth: '140px',
  flex: '1 1 140px',
});

/** 辉光按钮 */
export const glowButton = (active = false) => ({
  background: active ? 'rgba(74,127,196,0.15)' : 'rgba(255,255,255,0.03)',
  border: active ? `1px solid ${C.borderActive}` : `1px solid ${C.borderSubtle}`,
  borderRadius: '6px',
  padding: '8px 16px',
  cursor: 'pointer',
  color: active ? C.textPrimary : C.textSecondary,
  fontSize: '13px',
  fontFamily: FONT,
  transition: TRANS,
});

/** 小标签 */
export const badge = (color = C.accent) => ({
  display: 'inline-block',
  fontSize: '11px',
  padding: '2px 8px',
  background: color + '18',
  borderRadius: '3px',
  color,
  letterSpacing: '0.05em',
});

/** 势力等级标签 */
export const tierBadge = (tier) => {
  const map = {
    '帝': { bg: '#d4a85520', color: '#d4a855' },
    '祖': { bg: '#ff6a4a20', color: '#ff6a4a' },
    '仙': { bg: '#3dd6c820', color: '#3dd6c8' },
    '尊': { bg: '#c060ff20', color: '#c060ff' },
    '神': { bg: '#ffd85a20', color: '#ffd85a' },
    '王': { bg: '#4a7fc420', color: '#4a7fc4' },
  };
  const t = tier ? tier.charAt(0) : '';
  const m = map[t] || { bg: '#8898b820', color: '#8898b8' };
  return {
    display: 'inline-block',
    fontSize: '11px',
    padding: '3px 10px',
    background: m.bg,
    borderRadius: '3px',
    color: m.color,
    fontWeight: 600,
    letterSpacing: '0.05em',
  };
};
