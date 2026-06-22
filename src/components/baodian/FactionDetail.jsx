import { C, FONT, TRANS, badge, tierBadge } from './baodianStyles';
import ForceGraph from './ForceGraph';

const S = {
  wrapper: {
    padding: '16px 0', height: '100%', overflowY: 'auto',
  },
  backBtn: {
    background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer',
    fontSize: '13px', fontFamily: FONT, padding: 0, marginBottom: '16px',
    transition: TRANS, display: 'inline-block',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px',
  },
  seal: {
    width: '44px', height: '44px', borderRadius: '50%',
    background: 'rgba(74,127,196,0.12)',
    border: `2px solid ${C.borderActive}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '20px', color: C.accent, flexShrink: 0,
    boxShadow: '0 0 20px rgba(61,214,200,0.15)',
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: '20px', color: C.textPrimary, fontWeight: 700,
    marginBottom: '4px', letterSpacing: '0.04em',
  },
  subMeta: {
    fontSize: '12px', color: C.textMuted, display: 'flex', gap: '12px',
    flexWrap: 'wrap',
  },
  descSection: {
    marginTop: '16px',
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
  figuresRow: {
    display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px',
  },
  figureChip: {
    padding: '5px 14px', fontSize: '12px',
    background: 'rgba(212,168,85,0.1)', borderRadius: '14px',
    color: C.accentGold, cursor: 'pointer',
    border: `1px solid rgba(212,168,85,0.2)`,
    fontFamily: FONT, transition: TRANS,
  },
  tripleCol: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px', marginTop: '16px',
  },
  factionBox: {
    background: 'rgba(10,18,32,0.5)',
    border: `1px solid ${C.borderSubtle}`,
    borderRadius: '6px', padding: '12px 14px',
  },
  factionBoxTitle: {
    fontSize: '11px', color: C.textMuted, marginBottom: '8px',
    letterSpacing: '0.06em', fontWeight: 600,
  },
  factionItem: {
    fontSize: '13px', color: C.textSecondary, marginBottom: '4px',
    cursor: 'pointer', transition: TRANS,
    padding: '2px 0',
  },
  graphSection: {
    marginTop: '24px',
  },
  legend: {
    display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '10px',
  },
  legendItem: {
    display: 'flex', alignItems: 'center', gap: '5px',
    fontSize: '11px', color: C.textMuted,
  },
  legendDot: (color) => ({
    width: '8px', height: '8px', borderRadius: '50%', background: color,
  }),
};

export default function FactionDetail({ entry, allFactions, graphData, onBack, onSelectEntry }) {
  if (!entry) return null;

  const rels = entry.relations || {};
  const tier = rels['势力等级'] || '';
  const figures = rels['核心人物'] || [];
  const subFactions = rels['附属'] || [];
  const rivals = rels['敌对'] || [];
  const allies = rels['同盟'] || [];

  return (
    <div style={S.wrapper}>
      <button style={S.backBtn}
        onClick={onBack}
        onMouseEnter={(e) => { e.currentTarget.style.color = C.accent; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}>
        ← 返回列表
      </button>

      {/* 头部 */}
      <div style={S.header}>
        <div style={S.seal}>⚔</div>
        <div style={S.nameSection}>
          <div style={S.name}>{entry.name}</div>
          <div style={S.subMeta}>
            {tier && <span style={tierBadge(tier)}>{tier}</span>}
            {rels['所属天河'] && <span>{rels['所属天河']}</span>}
            {rels['所属星域'] && <span>· {rels['所属星域']}</span>}
          </div>
        </div>
      </div>

      {/* 势力介绍 */}
      <div style={S.descSection}>
        <div style={S.sectionTitle}>势力介绍</div>
        <div style={S.desc}>
          {entry.description || '暂无介绍，待修行者补充。'}
        </div>
      </div>

      {/* 核心人物 */}
      {Array.isArray(figures) && figures.length > 0 && (
        <div style={S.descSection}>
          <div style={S.sectionTitle}>核心人物</div>
          <div style={S.figuresRow}>
            {figures.map((name, i) => (
              <span key={i} style={S.figureChip}>{name}</span>
            ))}
          </div>
        </div>
      )}

      {/* 三栏：附属 / 敌对 / 同盟 */}
      {(subFactions.length > 0 || rivals.length > 0 || allies.length > 0) && (
        <div style={S.tripleCol}>
          {subFactions.length > 0 && (
            <div style={S.factionBox}>
              <div style={S.factionBoxTitle}>附属势力</div>
              {subFactions.map((name, i) => (
                <div key={i} style={S.factionItem}
                  onMouseEnter={(e) => { e.currentTarget.style.color = C.accentGold; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = C.textSecondary; }}>
                  {name}
                </div>
              ))}
            </div>
          )}
          {rivals.length > 0 && (
            <div style={S.factionBox}>
              <div style={S.factionBoxTitle}>敌对势力</div>
              {rivals.map((name, i) => (
                <div key={i} style={S.factionItem}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ff4a6a'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = C.textSecondary; }}>
                  {name}
                </div>
              ))}
            </div>
          )}
          {allies.length > 0 && (
            <div style={S.factionBox}>
              <div style={S.factionBoxTitle}>同盟势力</div>
              {allies.map((name, i) => (
                <div key={i} style={S.factionItem}
                  onMouseEnter={(e) => { e.currentTarget.style.color = C.accentGlow; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = C.textSecondary; }}>
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 势力关系图 */}
      {graphData && graphData.nodes && graphData.nodes.length > 0 && (
        <div style={S.graphSection}>
          <div style={S.sectionTitle}>势力关系图</div>
          <ForceGraph
            nodes={graphData.nodes}
            links={graphData.links}
            width={Math.min(700, window.innerWidth - 320)}
            height={420}
            onNodeClick={onSelectEntry}
          />
          <div style={S.legend}>
            <div style={S.legendItem}><span style={S.legendDot('#3dd6c8')} />同盟</div>
            <div style={S.legendItem}><span style={S.legendDot('#ff4a6a')} />敌对</div>
            <div style={S.legendItem}><span style={S.legendDot('#d4a855')} />附属</div>
            <div style={S.legendItem}><span style={S.legendDot('#4a5870')} />其他</div>
          </div>
        </div>
      )}
    </div>
  );
}
