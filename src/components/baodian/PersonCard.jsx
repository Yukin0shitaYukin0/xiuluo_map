import { C, FONT_BODY, FONT_TITLE, TRANS, badge } from './codexStyles';

const S = {
  card: {
    padding: '16px',
    background: 'rgba(13,15,20,0.7)',
    border: `1px solid ${C.borderSubtle}`,
    borderRadius: '4px',
    cursor: 'pointer',
    transition: TRANS,
  },
  name: {
    fontFamily: FONT_TITLE, fontSize: '15px', color: C.textPrimary,
    marginBottom: '10px', letterSpacing: '0.04em',
  },
  fields: {
    display: 'flex', flexDirection: 'column', gap: '4px',
    marginBottom: '8px',
  },
  field: {
    display: 'flex', fontSize: '11px', gap: '6px',
  },
  fieldKey: { color: C.textMuted, minWidth: '32px', flexShrink: 0 },
  fieldVal: { color: C.textSecondary },
  tags: {
    display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '8px',
  },
};

export default function PersonCard({ entry, onClick }) {
  const rels = entry.relations || {};
  const tags = entry.tags || [];

  return (
    <div style={S.card}
      onClick={() => onClick && onClick(entry.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.borderActive;
        e.currentTarget.style.boxShadow = `0 0 14px ${C.borderGlow}`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.borderSubtle;
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}>
      <div style={S.name}>{entry.name}</div>
      <div style={S.fields}>
        {rels['境界'] && (
          <div style={S.field}>
            <span style={S.fieldKey}>境界</span>
            <span style={S.fieldVal}>{rels['境界']}</span>
          </div>
        )}
        {rels['势力'] && (
          <div style={S.field}>
            <span style={S.fieldKey}>势力</span>
            <span style={S.fieldVal}>{rels['势力']}</span>
          </div>
        )}
        {rels['种族'] && (
          <div style={S.field}>
            <span style={S.fieldKey}>种族</span>
            <span style={S.fieldVal}>{rels['种族']}</span>
          </div>
        )}
        {rels['血脉'] && (
          <div style={S.field}>
            <span style={S.fieldKey}>血脉</span>
            <span style={S.fieldVal}>{rels['血脉']}</span>
          </div>
        )}
      </div>
      {tags.length > 0 && (
        <div style={S.tags}>
          {tags.slice(0, 4).map((t, i) => (
            <span key={i} style={badge(C.bronzeLight)}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}
