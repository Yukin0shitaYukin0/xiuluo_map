import { C, FONT_BODY, FONT_TITLE, TRANS, badge } from './codexStyles';

const S = {
  wrapper: {
    padding: '16px 0', height: '100%', overflowY: 'auto',
  },
  backBtn: {
    background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer',
    fontSize: '13px', fontFamily: FONT_BODY, padding: 0, marginBottom: '16px',
    transition: TRANS,
  },
  name: {
    fontFamily: FONT_TITLE, fontSize: '20px', color: C.gold,
    marginBottom: '8px', letterSpacing: '0.06em',
  },
  meta: {
    display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px',
  },
  section: { marginTop: '16px' },
  sectionTitle: {
    fontSize: '12px', color: C.bronzeLight, fontWeight: 600,
    marginBottom: '6px', letterSpacing: '0.06em',
    paddingBottom: '3px', borderBottom: `1px solid ${C.borderSubtle}`,
  },
  desc: {
    fontSize: '13px', lineHeight: '1.9', color: C.textSecondary,
    fontFamily: FONT_BODY,
  },
  relRow: {
    display: 'flex', marginBottom: '4px', fontSize: '12px',
  },
  relKey: { color: C.textMuted, minWidth: '60px', flexShrink: 0 },
  relVal: { color: C.textSecondary },
};

export default function SkillTreeDetail({ skill, onBack }) {
  if (!skill) return null;
  const rels = skill.relations || {};

  return (
    <div style={S.wrapper}>
      <button style={S.backBtn}
        onClick={onBack}
        onMouseEnter={(e) => { e.currentTarget.style.color = C.gold; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}>
        ← 返回神树
      </button>

      <h2 style={S.name}>{skill.name}</h2>
      <div style={S.meta}>
        <span style={badge(C.bronzeLight)}>{skill.category}</span>
        {skill.subcategory && <span style={badge(C.goldDim)}>{skill.subcategory}</span>}
        {skill.skillBranch && <span style={badge(C.jade)}>{skill.skillBranch}</span>}
        {(skill.tags || []).map((t, i) => <span key={i} style={badge(C.textSecondary)}>{t}</span>)}
      </div>

      <div style={S.desc}>
        {skill.description || '暂无描述，待修行者补充。'}
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
    </div>
  );
}
