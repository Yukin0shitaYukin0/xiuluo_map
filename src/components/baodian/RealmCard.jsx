import { C, FONT_BODY, TRANS } from './codexStyles';

const S = {
  card: {
    padding: '16px',
    background: 'rgba(13,15,20,0.7)',
    border: `1px solid ${C.borderSubtle}`,
    borderRadius: '4px',
    transition: TRANS,
  },
  name: {
    fontSize: '14px', color: C.textPrimary, fontWeight: 600,
    marginBottom: '8px', fontFamily: FONT_BODY,
  },
  field: {
    display: 'flex', fontSize: '11px', marginBottom: '3px', gap: '6px',
  },
  fieldKey: { color: C.textMuted, minWidth: '56px', flexShrink: 0 },
  fieldVal: { color: C.textSecondary },
  starBtn: {
    marginTop: '10px', padding: '5px 12px',
    background: 'rgba(196,168,106,0.08)',
    border: `1px solid ${C.borderSubtle}`,
    borderRadius: '3px', cursor: 'pointer',
    color: C.goldDim, fontSize: '11px', fontFamily: FONT_BODY,
    transition: TRANS, display: 'inline-block',
  },
};

export default function RealmCard({ entry, onClick, onViewInStarMap }) {
  const rels = entry.relations || {};

  return (
    <div style={S.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.borderActive;
        e.currentTarget.style.boxShadow = `0 0 12px ${C.borderGlow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.borderSubtle;
        e.currentTarget.style.boxShadow = 'none';
      }}>
      <div style={S.name}
        onClick={() => onClick && onClick(entry.id)}
        onMouseEnter={(e) => { e.currentTarget.style.color = C.gold; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = C.textPrimary; }}>
        {entry.name}
      </div>

      {rels['所属天河'] && (
        <div style={S.field}>
          <span style={S.fieldKey}>所属天河</span>
          <span style={S.fieldVal}>{rels['所属天河']}</span>
        </div>
      )}
      {rels['所属星域'] && (
        <div style={S.field}>
          <span style={S.fieldKey}>所属星域</span>
          <span style={S.fieldVal}>{rels['所属星域']}</span>
        </div>
      )}
      {rels['关联人物'] && (
        <div style={S.field}>
          <span style={S.fieldKey}>关联人物</span>
          <span style={S.fieldVal}>
            {Array.isArray(rels['关联人物']) ? rels['关联人物'].join('、') : rels['关联人物']}
          </span>
        </div>
      )}
      {rels['关联势力'] && (
        <div style={S.field}>
          <span style={S.fieldKey}>关联势力</span>
          <span style={S.fieldVal}>{rels['关联势力']}</span>
        </div>
      )}

      {entry.starNodeId && onViewInStarMap && (
        <div style={S.starBtn}
          onClick={() => onViewInStarMap(entry.starNodeId)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(196,168,106,0.16)';
            e.currentTarget.style.borderColor = C.borderActive;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(196,168,106,0.08)';
            e.currentTarget.style.borderColor = C.borderSubtle;
          }}>
          ✦ 在星图中查看
        </div>
      )}
    </div>
  );
}
