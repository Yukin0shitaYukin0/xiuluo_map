import { C, FONT_BODY, FONT_TITLE, TRANS, badge } from './codexStyles';
import ForceGraph from './ForceGraph';

const S = {
  wrapper: { padding: '16px 0', height: '100%', overflowY: 'auto' },
  backBtn: {
    background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer',
    fontSize: '13px', fontFamily: FONT_BODY, padding: 0, marginBottom: '16px',
    transition: TRANS,
  },
  header: { display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '12px' },
  name: {
    fontFamily: FONT_TITLE, fontSize: '22px', color: C.gold,
    letterSpacing: '0.06em', flex: 1,
  },
  meta: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '10px', marginBottom: '16px',
  },
  infoBox: {
    padding: '12px 14px', background: 'rgba(13,15,20,0.5)',
    border: `1px solid ${C.borderSubtle}`, borderRadius: '4px',
  },
  infoTitle: {
    fontSize: '11px', color: C.bronzeLight, marginBottom: '6px',
    letterSpacing: '0.05em', fontWeight: 600,
  },
  infoContent: {
    fontSize: '12px', color: C.textSecondary, lineHeight: '1.7',
    fontFamily: FONT_BODY,
  },
  section: { marginTop: '16px' },
  sectionTitle: {
    fontSize: '12px', color: C.bronzeLight, fontWeight: 600,
    marginBottom: '6px', letterSpacing: '0.06em',
    paddingBottom: '3px', borderBottom: `1px solid ${C.borderSubtle}`,
  },
};

export default function PersonDetail({ entry, graphData, onBack, onSelectEntry }) {
  if (!entry) return null;
  const rels = entry.relations || {};

  const infoBlocks = [];
  if (rels['境界']) infoBlocks.push({ title: '境界', content: rels['境界'] });
  if (rels['势力']) infoBlocks.push({ title: '势力', content: rels['势力'] });
  if (rels['种族']) infoBlocks.push({ title: '种族', content: rels['种族'] });
  if (rels['血脉']) infoBlocks.push({ title: '血脉', content: rels['血脉'] });
  if (rels['神体']) infoBlocks.push({ title: '神体', content: rels['神体'] });

  const weapons = rels['兵器'] || [];
  const skills = rels['功法'] || [];
  const experience = rels['重要经历'] || '';

  return (
    <div style={S.wrapper}>
      <button style={S.backBtn}
        onClick={onBack}
        onMouseEnter={(e) => { e.currentTarget.style.color = C.gold; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}>
        ← 返回人物谱
      </button>

      <h2 style={S.name}>{entry.name}</h2>
      <div style={S.meta}>
        <span style={badge(C.goldDim)}>{entry.category}</span>
        {(entry.tags || []).map((t, i) => (
          <span key={i} style={badge(C.textSecondary)}>{t}</span>
        ))}
      </div>

      {/* 属性信息 */}
      {infoBlocks.length > 0 && (
        <div style={S.grid}>
          {infoBlocks.map((b) => (
            <div key={b.title} style={S.infoBox}>
              <div style={S.infoTitle}>{b.title}</div>
              <div style={S.infoContent}>{b.content}</div>
            </div>
          ))}
        </div>
      )}

      {/* 兵器 */}
      {Array.isArray(weapons) && weapons.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionTitle}>兵器</div>
          <div style={S.infoContent}>{weapons.join('、')}</div>
        </div>
      )}

      {/* 功法 */}
      {Array.isArray(skills) && skills.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionTitle}>功法</div>
          <div style={S.infoContent}>{skills.join('、')}</div>
        </div>
      )}

      {/* 重要经历 */}
      {experience && (
        <div style={S.section}>
          <div style={S.sectionTitle}>重要经历</div>
          <div style={S.infoContent}>{experience}</div>
        </div>
      )}

      {/* 人物关系图 */}
      {graphData && graphData.nodes && graphData.nodes.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionTitle}>人物关系</div>
          <ForceGraph
            nodes={graphData.nodes}
            links={graphData.links}
            width={Math.min(600, window.innerWidth - 320)}
            height={360}
            onNodeClick={onSelectEntry}
          />
        </div>
      )}
    </div>
  );
}
