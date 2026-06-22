import { C, FONT_TITLE, FONT_BODY, TRANS } from './codexStyles';

const S = {
  sidebar: {
    width: '220px', minWidth: '220px', height: '100vh',
    background: 'rgba(10,12,18,0.93)',
    borderRight: `1px solid ${C.borderSubtle}`,
    overflowY: 'auto', padding: '0',
    position: 'relative', zIndex: 1,
  },
  header: {
    padding: '18px 14px 14px',
    textAlign: 'center',
    borderBottom: `1px solid ${C.borderSubtle}`,
  },
  headerTitle: {
    fontFamily: FONT_TITLE,
    fontSize: '18px', color: C.goldDim,
    letterSpacing: '0.15em',
    fontWeight: 700,
  },
  headerLine: {
    display: 'block', width: '40px', height: '1px',
    background: `linear-gradient(90deg, transparent, ${C.bronze}, transparent)`,
    margin: '8px auto 0',
  },
  catBtn: (active, hasSub) => ({
    display: 'flex', alignItems: 'center', gap: '8px',
    width: '100%', border: 'none',
    background: active && !hasSub ? 'rgba(196,168,106,0.06)' : 'transparent',
    color: active ? C.textPrimary : C.textSecondary,
    fontSize: '13px', padding: '9px 14px', cursor: 'pointer',
    textAlign: 'left', fontFamily: FONT_BODY,
    transition: TRANS,
    borderLeft: active ? `2px solid ${C.goldDim}` : '2px solid transparent',
  }),
  catIcon: { fontSize: '13px', width: '20px', textAlign: 'center', flexShrink: 0, opacity: 0.7 },
  catLabel: { flex: 1 },
  catArrow: (expanded) => ({
    fontSize: '9px', color: C.textMuted, transition: TRANS,
    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
  }),
  subWrap: {
    overflow: 'hidden',
    transition: 'max-height 0.3s ease',
  },
  subBtn: (active) => ({
    display: 'flex', alignItems: 'center', gap: '6px',
    width: '100%', border: 'none',
    background: active ? 'rgba(196,168,106,0.06)' : 'transparent',
    color: active ? C.goldDim : C.textMuted,
    fontSize: '12px', padding: '6px 14px 6px 42px', cursor: 'pointer',
    textAlign: 'left', fontFamily: FONT_BODY,
    transition: TRANS,
    borderLeft: active ? `2px solid ${C.bronze}` : '2px solid transparent',
  }),
};

export default function CodexSidebar({
  categories, activeCat, activeSub,
  onSelectCat, onSelectSub, entryCounts,
}) {
  return (
    <div style={S.sidebar}>
      <div style={S.header}>
        <div style={S.headerTitle}>修 罗 谱</div>
        <span style={S.headerLine} />
      </div>

      {categories.map((cat) => {
        const isActive = activeCat === cat.key;
        const hasSub = cat.sub && cat.sub.length > 0;
        const catCount = entryCounts[cat.key] || 0;

        return (
          <div key={cat.key}>
            <button style={S.catBtn(isActive, hasSub)}
              onClick={() => onSelectCat(cat.key)}>
              <span style={S.catIcon}>{cat.icon || '◈'}</span>
              <span style={S.catLabel}>{cat.label}</span>
              {hasSub && <span style={S.catArrow(isActive)}>▶</span>}
            </button>

            {hasSub && (
              <div style={{
                ...S.subWrap,
                maxHeight: isActive ? (cat.sub.length * 30) + 'px' : '0px',
              }}>
                {cat.sub.map((sub) => {
                  const subActive = activeSub === sub.key;
                  return (
                    <button key={sub.key} style={S.subBtn(subActive)}
                      onClick={(e) => { e.stopPropagation(); onSelectSub(sub.key); }}>
                      {sub.label}
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
