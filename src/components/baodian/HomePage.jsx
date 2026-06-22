import { C, FONT_BODY, textGradient, statCard, TRANS } from './codexStyles';

const ICONS = {
  '人物谱': '⚔',
  '势力录': '🏯',
  '功法阁': '📜',
  '神兵录': '🗡',
  '秘境志': '🏛',
  '奇珍录': '💎',
  '血脉录': '🩸',
};

const LABELS = {
  '人物谱': '人物总数',
  '势力录': '势力总数',
  '功法阁': '功法总数',
  '神兵录': '神兵总数',
  '秘境志': '秘境总数',
};

const STAT_KEYS = ['人物谱', '势力录', '功法阁', '神兵录', '秘境志'];

const S = {
  wrapper: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '28px 20px', maxWidth: '780px', margin: '0 auto',
    height: '100%', overflowY: 'auto',
  },
  title: {
    fontFamily: FONT_BODY, fontSize: '26px', fontWeight: 700,
    letterSpacing: '0.06em', marginBottom: '6px',
    ...textGradient(C.accent, C.accentGold),
  },
  subtitle: {
    fontSize: '12px', color: C.textMuted, fontFamily: FONT_BODY,
    letterSpacing: '0.1em', marginBottom: '36px',
  },
  statRow: {
    display: 'flex', gap: '14px', flexWrap: 'wrap',
    justifyContent: 'center', width: '100%', marginBottom: '32px',
  },
  statNum: {
    fontSize: '24px', fontWeight: 700, color: C.textPrimary,
    marginBottom: '4px', fontFamily: FONT_BODY,
  },
  statLabel: {
    fontSize: '12px', color: C.textMuted, letterSpacing: '0.05em',
  },
  statIcon: {
    fontSize: '22px', marginBottom: '8px',
  },
  introBox: {
    width: '100%', padding: '20px 24px',
    background: 'rgba(10,18,32,0.5)',
    border: `1px solid ${C.borderSubtle}`,
    borderRadius: '8px',
    fontSize: '13px', lineHeight: '1.9', color: C.textSecondary,
    fontFamily: FONT_BODY, textAlign: 'center',
    marginBottom: '24px',
  },
  quickNav: {
    display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center',
  },
  navPill: {
    padding: '8px 18px',
    background: 'rgba(10,18,32,0.6)',
    border: `1px solid ${C.borderSubtle}`,
    borderRadius: '20px', cursor: 'pointer',
    color: C.textSecondary, fontSize: '13px', fontFamily: FONT_BODY,
    transition: TRANS,
  },
};

export default function HomePage({ stats, onSelectCat }) {
  return (
    <div style={S.wrapper}>
      <h1 style={S.title}>修罗武神 · 九道天河宝典</h1>
      <div style={S.subtitle}>万象归宗，道法自然</div>

      {/* 统计卡片 */}
      <div style={S.statRow}>
        {STAT_KEYS.map((key) => (
          <div key={key} style={statCard()}
            onClick={() => onSelectCat && onSelectCat(key)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.borderActive;
              e.currentTarget.style.boxShadow = '0 0 20px rgba(61,214,200,0.12)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.borderSubtle;
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
            <div style={S.statIcon}>{ICONS[key] || '✦'}</div>
            <div style={S.statNum}>{stats[key] ?? 0}</div>
            <div style={S.statLabel}>{LABELS[key] || key}</div>
          </div>
        ))}
      </div>

      {/* 世界导语 */}
      <div style={S.introBox}>
        九道天河横亘寰宇，亿万星辰散落其间。<br />
        太古神域屹立中央，诸天万界环拱而生。<br />
        此典收录修罗武神世界之人物、势力、功法、神兵、奇珍、秘境、血脉，<br />
        供修行者览阅参详，以窥天地之奥，大道之秘。
      </div>

      {/* 快速导航 */}
      <div style={S.quickNav}>
        {STAT_KEYS.map((key) => (
          <div key={key} style={S.navPill}
            onClick={() => onSelectCat && onSelectCat(key)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.borderActive;
              e.currentTarget.style.color = C.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.borderSubtle;
              e.currentTarget.style.color = C.textSecondary;
            }}>
            {ICONS[key] || ''} {key}
          </div>
        ))}
      </div>
    </div>
  );
}
