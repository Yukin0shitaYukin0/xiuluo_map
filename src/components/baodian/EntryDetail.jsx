import { C, FONT, TRANS, badge } from './baodianStyles';

const S = {
  wrapper: {
    padding: '16px 0', height: '100%', overflowY: 'auto',
  },
  backBtn: {
    background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer',
    fontSize: '13px', fontFamily: FONT, padding: 0, marginBottom: '16px',
    transition: TRANS, display: 'inline-block',
  },
  name: {
    fontSize: '20px', color: C.textPrimary, fontWeight: 700,
    marginBottom: '10px', letterSpacing: '0.04em',
  },
  metaRow: {
    display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px',
  },
  section: {
    marginTop: '20px',
  },
  sectionTitle: {
    fontSize: '13px', color: C.accent, fontWeight: 600,
    marginBottom: '8px', letterSpacing: '0.06em',
    paddingBottom: '4px',
    borderBottom: `1px solid ${C.borderSubtle}`,
  },
  desc: {
    fontSize: '13px', lineHeight: '1.9', color: C.textSecondary,
    fontFamily: FONT,
  },
  relRow: {
    display: 'flex', marginBottom: '5px', fontSize: '13px',
  },
  relKey: {
    color: C.textMuted, minWidth: '70px', flexShrink: 0,
  },
  relVal: {
    color: C.textSecondary,
  },
  relatedRow: {
    display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px',
  },
  relatedPill: {
    padding: '4px 12px', fontSize: '12px',
    background: 'rgba(74,127,196,0.1)', borderRadius: '14px',
    color: C.accent, cursor: 'pointer',
    border: `1px solid ${C.borderSubtle}`,
    fontFamily: FONT, transition: TRANS,
  },
  empty: {
    padding: '32px 0', color: C.textMuted, fontSize: '13px',
    textAlign: 'center',
  },
};

export default function EntryDetail({ entry, onBack, onSelectEntry }) {
  if (!entry) return null;

  const rels = entry.relations || {};
  const related = entry.related || [];

  return (
    <div style={S.wrapper}>
      <button style={S.backBtn}
        onClick={onBack}
        onMouseEnter={(e) => { e.currentTarget.style.color = C.accent; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}>
        ← 返回列表
      </button>

      <h1 style={S.name}>{entry.name}</h1>

      <div style={S.metaRow}>
        <span style={badge(C.accent)}>{entry.category}</span>
        {entry.subcategory && <span style={badge(C.accentGlow)}>{entry.subcategory}</span>}
        {(entry.tags || []).map((t, i) => (
          <span key={i} style={badge(C.textSecondary)}>{t}</span>
        ))}
      </div>

      <div style={S.desc}>
        {entry.description || '暂无描述，待修行者补充。'}
      </div>

      {Object.keys(rels).length > 0 && (
        <div style={S.section}>
          <div style={S.sectionTitle}>关联信息</div>
          {Object.entries(rels).map(([k, v]) => (
            <div key={k} style={S.relRow}>
              <span style={S.relKey}>{k}</span>
              <span style={S.relVal}>{Array.isArray(v) ? v.join('、') : v}</span>
            </div>
          ))}
        </div>
      )}

      {related.length > 0 && onSelectEntry && (
        <div style={S.section}>
          <div style={S.sectionTitle}>关联词条</div>
          <div style={S.relatedRow}>
            {related.map((rid) => (
              <button key={rid} style={S.relatedPill}
                onClick={() => onSelectEntry(rid)}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderActive; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.borderSubtle; }}>
                {rid}
              </button>
            ))}
          </div>
        </div>
      )}

      {!entry.description && Object.keys(rels).length === 0 && related.length === 0 && (
        <div style={S.empty}>暂无详细信息，待修行者补充</div>
      )}
    </div>
  );
}
