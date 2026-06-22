import { useMemo } from 'react';
import { C, FONT_BODY, FONT_TITLE, TRANS, metalBorder, badge } from './codexStyles';

const ARMORY_ORDER = [
  '半成奇兵','奇兵','半成王兵','王兵','半成帝兵','帝兵',
  '半成祖兵','祖兵','半成仙兵','仙兵','半成尊兵','尊兵',
  '半成神兵','神兵',
];

const S = {
  wrapper: {
    padding: '16px 0', height: '100%', overflowY: 'auto',
  },
  title: {
    fontFamily: FONT_TITLE, fontSize: '20px', color: C.gold,
    marginBottom: '20px', letterSpacing: '0.06em',
  },
  group: { marginBottom: '20px' },
  groupTitle: {
    fontFamily: FONT_BODY, fontSize: '13px', color: C.bronzeLight,
    marginBottom: '10px', paddingBottom: '4px',
    borderBottom: `1px solid ${C.borderSubtle}`,
    letterSpacing: '0.06em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '12px',
  },
  card: {
    ...metalBorder(),
    padding: '16px',
    background: 'rgba(13,15,20,0.7)',
    borderRadius: '3px',
    cursor: 'pointer',
    transition: TRANS,
  },
  cardName: {
    fontFamily: FONT_TITLE, fontSize: '15px', color: C.textPrimary,
    marginBottom: '8px', letterSpacing: '0.04em',
  },
  cardField: {
    display: 'flex', fontSize: '11px', marginBottom: '3px',
    gap: '6px',
  },
  fieldKey: { color: C.textMuted, minWidth: '44px', flexShrink: 0 },
  fieldVal: { color: C.textSecondary },
  empty: {
    color: C.textMuted, fontSize: '13px', textAlign: 'center',
    padding: '40px 0',
  },
};

export default function Armory({ entries, onSelectWeapon }) {
  const groups = useMemo(() => {
    const map = {};
    for (const key of ARMORY_ORDER) map[key] = [];
    for (const entry of (entries || [])) {
      const sub = entry.subcategory || '其他';
      if (!map[sub]) map[sub] = [];
      map[sub].push(entry);
    }
    const result = [];
    for (const key of ARMORY_ORDER) {
      if (map[key] && map[key].length > 0) result.push({ key, items: map[key] });
    }
    return result;
  }, [entries]);

  if (!entries || entries.length === 0) {
    return (
      <div style={S.wrapper}>
        <div style={S.title}>兵器陈列馆</div>
        <div style={S.empty}>诸般神兵，待修行者录入……</div>
      </div>
    );
  }

  return (
    <div style={S.wrapper}>
      <div style={S.title}>兵器陈列馆</div>
      {groups.map(({ key, items }) => (
        <div key={key} style={S.group}>
          <div style={S.groupTitle}>{key}</div>
          <div style={S.grid}>
            {items.map((w) => {
              const rels = w.relations || {};
              return (
                <div key={w.id} style={S.card}
                  onClick={() => onSelectWeapon && onSelectWeapon(w.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.borderActive;
                    e.currentTarget.style.boxShadow = `0 0 12px ${C.borderGlow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.borderSubtle;
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                  <div style={S.cardName}>{w.name}</div>
                  <div style={S.cardField}>
                    <span style={S.fieldKey}>等级</span>
                    <span style={S.fieldVal}>{rels['等级'] || w.subcategory || '未知'}</span>
                  </div>
                  <div style={S.cardField}>
                    <span style={S.fieldKey}>拥有者</span>
                    <span style={S.fieldVal}>
                      {Array.isArray(rels['拥有者']) ? rels['拥有者'].join('、') : (rels['拥有者'] || '未知')}
                    </span>
                  </div>
                  {rels['关联势力'] && (
                    <div style={S.cardField}>
                      <span style={S.fieldKey}>势力</span>
                      <span style={S.fieldVal}>{rels['关联势力']}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
