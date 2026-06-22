import { C, FONT, TRANS, tierBadge } from './baodianStyles';

const FIELD_STYLE = {
  fontSize: '12px', color: C.textMuted, marginBottom: '4px',
  display: 'flex', alignItems: 'flex-start', gap: '6px',
};
const FIELD_LABEL = { color: C.textMuted, minWidth: '52px', flexShrink: 0 };
const FIELD_VALUE = { color: C.textSecondary };

const S = {
  card: {
    padding: '20px 18px',
    background: 'rgba(10,18,32,0.7)',
    border: `1px solid ${C.borderSubtle}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: TRANS,
    backdropFilter: 'blur(4px)',
  },
  name: {
    fontSize: '16px', color: C.textPrimary, fontWeight: 700,
    marginBottom: '10px', letterSpacing: '0.04em',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  divider: {
    height: '1px', background: C.borderSubtle, margin: '10px 0',
  },
  desc: {
    fontSize: '12px', color: C.textMuted, lineHeight: '1.7', fontStyle: 'italic',
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
    overflow: 'hidden', marginTop: '8px',
  },
};

function Field({ label, value }) {
  return (
    <div style={FIELD_STYLE}>
      <span style={FIELD_LABEL}>{label}</span>
      <span style={FIELD_VALUE}>{value || '未知'}</span>
    </div>
  );
}

export default function FactionCard({ entry, onClick }) {
  const rels = entry.relations || {};

  return (
    <div style={S.card}
      onClick={() => onClick && onClick(entry.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.borderActive;
        e.currentTarget.style.boxShadow = '0 0 16px rgba(74,127,196,0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.borderSubtle;
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}>
      <div style={S.name}>
        {entry.name}
        {rels['势力等级'] && <span style={tierBadge(rels['势力等级'])}>{rels['势力等级']}</span>}
      </div>

      <Field label="所属天河" value={rels['所属天河']} />
      <Field label="所属星域" value={rels['所属星域']} />
      <Field label="核心人物" value={
        Array.isArray(rels['核心人物']) ? rels['核心人物'].join('、') : rels['核心人物']
      } />

      <div style={S.divider} />

      {entry.description && (
        <div style={S.desc}>{entry.description.slice(0, 100)}</div>
      )}
    </div>
  );
}
