/**
 * 藏经阁共享样式系统 — 远古青铜暗金色板 + 古风样式工厂
 */

// ==================== 色板 ====================
export const C = {
  bgBlack:      '#08080c',
  bgDeep:       '#0d0f14',
  bgSurface:    '#13161f',
  bgElevated:   '#1a1d28',
  bronze:       '#8b7355',
  bronzeLight:  '#b8a080',
  goldDim:      '#9e8a5e',
  gold:         '#c4a86a',
  goldBright:   '#dcc890',
  vermillion:   '#a04040',
  jade:         '#5a8a6a',
  textPrimary:  '#d8d0c0',
  textSecondary:'#908878',
  textMuted:    '#5a5040',
  borderSubtle: 'rgba(139,115,85,0.12)',
  borderActive: 'rgba(196,168,106,0.35)',
  borderGlow:   'rgba(196,168,106,0.2)',
  danger:       '#a04040',
};

// ==================== 字体 ====================
export const FONT_TITLE = '"STKaiti", "KaiTi", "STSong", "SimSun", serif';
export const FONT_BODY  = '"Noto Serif SC", "SimSun", "STSong", serif';

// ==================== 转场 ====================
export const TRANS = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

// ==================== 样式工厂 ====================

/** 竹简面板 — 古书页质感 */
export const scrollPanel = (opacity = 0.7) => ({
  background: `rgba(13,15,20,${opacity})`,
  border: `1px solid ${C.borderSubtle}`,
  borderRadius: '4px',
});

/** 辉光边框 */
export const glowBorder = (active) => ({
  border: active ? `1px solid ${C.borderActive}` : `1px solid ${C.borderSubtle}`,
  boxShadow: active ? `0 0 10px ${C.borderGlow}, inset 0 0 4px rgba(196,168,106,0.04)` : 'none',
  transition: TRANS,
});

/** 文字渐变 — 暗金 */
export const textGradient = (from = C.gold, to = C.goldBright) => ({
  background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

/** 统计卡片 */
export const statCard = () => ({
  ...scrollPanel(0.5),
  padding: '18px 14px', textAlign: 'center', cursor: 'pointer',
  transition: TRANS, minWidth: '130px', flex: '1 1 130px',
});

/** 小标签 */
export const badge = (color = C.bronzeLight) => ({
  display: 'inline-block', fontSize: '10px', padding: '2px 8px',
  background: color + '15', borderRadius: '2px', color,
  letterSpacing: '0.05em',
});

/** 等级标签 */
export const tierBadge = (tier) => {
  const map = {
    '帝': { bg: '#d4a85520', color: '#d4a855' },
    '祖': { bg: '#ff6a4a20', color: '#ff6a4a' },
    '仙': { bg: '#5a8a6a20', color: '#5a8a6a' },
    '尊': { bg: '#a060d020', color: '#a060d0' },
    '神': { bg: '#dcc89020', color: '#dcc890' },
    '王': { bg: '#8b735520', color: '#b8a080' },
  };
  const t = tier ? tier.charAt(0) : '';
  const m = map[t] || { bg: '#90887820', color: '#908878' };
  return {
    display: 'inline-block', fontSize: '10px', padding: '2px 8px',
    background: m.bg, borderRadius: '2px', color: m.color,
    fontWeight: 600, letterSpacing: '0.05em',
  };
};

/** 金属质感边框（兵器卡片） */
export const metalBorder = () => ({
  border: `1px solid ${C.borderSubtle}`,
  borderImage: `linear-gradient(135deg, ${C.bronze}22, ${C.gold}44, ${C.bronze}22) 1`,
  borderRadius: '3px',
});

/** 装饰角标 */
export const cornerOrnament = (color = C.bronze) => ({
  position: 'absolute', width: '12px', height: '12px',
  borderColor: color, borderStyle: 'solid',
  opacity: 0.4,
});
