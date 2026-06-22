import { C, FONT, TRANS } from './baodianStyles';

const S = {
  sidebar: {
    width: '240px', minWidth: '240px', height: '100vh',
    background: 'rgba(8,14,26,0.92)',
    borderRight: `1px solid ${C.borderSubtle}`,
    backdropFilter: 'blur(8px)',
    overflowY: 'auto', padding: '48px 0 0 0',
    position: 'relative', zIndex: 1,
  },
  header: {
    padding: '20px 16px 14px',
    fontSize: '20px', color: C.textPrimary, fontWeight: 700,
    letterSpacing: '0.08em', textAlign: 'center',
    borderBottom: `1px solid ${C.borderSubtle}`,
    fontFamily: FONT,
  },
  headerGlow: {
    display: 'block', width: '32px', height: '1px',
    background: `linear-gradient(90deg, transparent, ${C.accentGlow}, transparent)`,
    margin: '8px auto 0',
  },
  catBtn: (active, hasSub) => ({
    display: 'flex', alignItems: 'center', gap: '8px',
    width: '100%', border: 'none',
    background: active && !hasSub ? 'rgba(74,127,196,0.12)' : 'transparent',
    color: active ? C.textPrimary : C.textSecondary,
    fontSize: '13px', padding: '10px 16px', cursor: 'pointer',
    textAlign: 'left', fontFamily: FONT,
    transition: TRANS,
    borderLeft: active ? `2px solid ${C.accentGlow}` : '2px solid transparent',
  }),
  catIcon: { fontSize: '14px', width: '20px', textAlign: 'center', flexShrink: 0 },
  catLabel: { flex: 1 },
  catCount: {
    fontSize: '10px', color: C.textMuted, minWidth: '18px', textAlign: 'right',
  },
  catArrow: (expanded) => ({
    fontSize: '10px', color: C.textMuted, transition: TRANS,
    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
    marginLeft: '2px',
  }),
  subWrap: {
    overflow: 'hidden',
    transition: 'max-height 0.3s ease',
  },
  subBtn: (active) => ({
    display: 'flex', alignItems: 'center', gap: '6px',
    width: '100%', border: 'none',
    background: active ? 'rgba(74,127,196,0.08)' : 'transparent',
    color: active ? C.accent : C.textMuted,
    fontSize: '12px', padding: '6px 16px 6px 44px', cursor: 'pointer',
    textAlign: 'left', fontFamily: FONT,
    transition: TRANS,
    borderLeft: active ? `2px solid ${C.accent}` : '2px solid transparent',
  }),
  subCount: {
    fontSize: '10px', color: C.textMuted, marginLeft: 'auto',
  },
};

function SidebarHeader() {
  return (
    <div style={S.header}>
      典
      <span style={S.headerGlow} />
    </div>
  );
}

export default function Sidebar({
  categories, activeCat, activeSub,
  onSelectCat, onSelectSub, entryCounts,
}) {
  return (
    <div style={S.sidebar}>
      <SidebarHeader />
      {categories.map((cat) => {
        const isActive = activeCat === cat.key;
        const hasSub = cat.sub && cat.sub.length > 0;
        const catCount = entryCounts[cat.key] || 0;

        return (
          <div key={cat.key}>
            <button style={S.catBtn(isActive, hasSub)}
              onClick={() => onSelectCat(cat.key)}>
              <span style={S.catIcon}>{cat.icon || '✦'}</span>
              <span style={S.catLabel}>{cat.label}</span>
              {catCount > 0 && <span style={S.catCount}>{catCount}</span>}
              {hasSub && <span style={S.catArrow(isActive)}>▶</span>}
            </button>

            {hasSub && (
              <div style={{
                ...S.subWrap,
                maxHeight: isActive ? (cat.sub.length * 32) + 'px' : '0px',
              }}>
                {cat.sub.map((sub) => {
                  const subActive = activeSub === sub.key;
                  const subCount = entryCounts[sub.key] || 0;
                  return (
                    <button key={sub.key} style={S.subBtn(subActive)}
                      onClick={(e) => { e.stopPropagation(); onSelectSub(sub.key); }}>
                      {sub.label}
                      {subCount > 0 && <span style={S.subCount}>({subCount})</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
