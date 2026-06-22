import { C, FONT_BODY, TRANS, badge } from './codexStyles';

const S = {
  card: {
    padding: '18px 16px',
    background: 'rgba(10,18,32,0.7)',
    border: `1px solid ${C.borderSubtle}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: TRANS,
    backdropFilter: 'blur(4px)',
  },
  name: {
    fontSize: '14px', color: C.textPrimary, fontWeight: 600,
    marginBottom: '6px', letterSpacing: '0.03em',
  },
  meta: {
    display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px',
  },
  desc: {
    fontSize: '12px', color: C.textMuted, lineHeight: '1.6',
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  tags: {
    display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '10px',
  },
  tagOverflow: {
    fontSize: '11px', color: C.textMuted, lineHeight: '20px',
  },
};

export default function EntryCard({ entry, onClick }) {
  const tags = entry.tags || [];
  const visibleTags = tags.slice(0, 4);
  const overflow = tags.length - 4;

  return (
    <div style={S.card}
      onClick={() => onClick && onClick(entry.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.borderActive;
        e.currentTarget.style.boxShadow = '0 0 16px rgba(74,127,196,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.borderSubtle;
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}>
      <div style={S.name}>{entry.name}</div>
      <div style={S.meta}>
        <span style={badge(C.accent)}>{entry.subcategory || entry.category}</span>
      </div>
      {entry.description && (
        <div style={S.desc}>{entry.description.slice(0, 100)}</div>
      )}
      {tags.length > 0 && (
        <div style={S.tags}>
          {visibleTags.map((t, i) => (
            <span key={i} style={badge(C.textSecondary)}>{t}</span>
          ))}
          {overflow > 0 && <span style={S.tagOverflow}>+{overflow}</span>}
        </div>
      )}
    </div>
  );
}
