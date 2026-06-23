import { useEffect, useRef } from 'react';
import { ENTRIES } from '../data/baodianData';

const TYPE_NAMES = {
  taigu: '太古神域',
  tianhe: '天河',
  xingyu: '星域',
  shangjie: '上界',
  fanjie: '凡界',
  xiajie: '下界',
};

const S = {
  overlay: {
    position: 'absolute', top: 0, right: 0, width: '340px', height: '100vh',
    zIndex: 25, pointerEvents: 'none',
  },
  panel: {
    position: 'absolute', top: '20px', right: '16px', bottom: '20px', width: '320px',
    background: 'rgba(8,12,24,0.82)', border: '1px solid rgba(120,160,200,0.12)',
    borderRadius: '8px',
    backdropFilter: 'blur(12px)',
    padding: '32px 24px',
    overflowY: 'auto',
    color: '#b0bcc8',
    fontFamily: '"Noto Serif SC", "SimSun", "STSong", serif',
    pointerEvents: 'auto',
  },
  typeBadge: (color) => ({
    display: 'inline-block',
    fontSize: '11px', color, padding: '2px 10px',
    background: color + '18', borderRadius: '3px',
    marginBottom: '12px', letterSpacing: '0.05em',
  }),
  name: {
    fontSize: '26px', color: '#e4e8f0', fontWeight: 700,
    marginBottom: '6px', letterSpacing: '0.05em',
  },
  desc: {
    fontSize: '13px', lineHeight: '1.8', color: '#8890a0',
    marginTop: '16px',
  },
  section: {
    marginTop: '20px',
  },
  sectionTitle: {
    fontSize: '11px', color: '#5a6880', letterSpacing: '0.1em',
    marginBottom: '8px', paddingBottom: '4px',
    borderBottom: '1px solid rgba(120,160,200,0.08)',
  },
  tagRow: {
    display: 'flex', gap: '6px', flexWrap: 'wrap',
  },
  tag: {
    fontSize: '11px', padding: '3px 8px', background: 'rgba(120,160,200,0.08)',
    borderRadius: '3px', color: '#7080a0',
  },
  linkBtn: {
    marginTop: '24px', width: '100%', padding: '10px',
    background: 'rgba(120,160,200,0.1)', border: '1px solid rgba(120,160,200,0.2)',
    borderRadius: '4px', color: '#8898b8', cursor: 'pointer',
    fontSize: '13px', fontFamily: 'inherit',
    transition: 'all 0.2s',
  },
  empty: {
    fontSize: '13px', color: '#4a5870', marginTop: '16px',
    textAlign: 'center', padding: '40px 0',
  },
};

export default function StarDetailPanel({ node, onSwitchToBaodian }) {
  const panelRef = useRef();

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = 0;
    }
  }, [node?.id]);

  if (!node) return null;

  const entry = node.baodianId ? ENTRIES[node.baodianId] : null;
  const color = node.color || '#8898b8';
  const typeName = TYPE_NAMES[node.type] || node.type;

  return (
    <div style={S.overlay}>
      <div ref={panelRef} style={S.panel}>
        {/* 类型标识 */}
        <div style={S.typeBadge(color)}>{typeName}</div>

        {/* 名称 */}
        <h2 style={S.name}>{node.name}</h2>

        {/* 标签 */}
        {node.tags && node.tags.length > 0 && (
          <div style={S.section}>
            <div style={S.sectionTitle}>标签</div>
            <div style={S.tagRow}>
              {node.tags.map((t, i) => <span key={i} style={S.tag}>{t}</span>)}
            </div>
          </div>
        )}

        {/* 有百科词条时显示摘要 */}
        {entry ? (
          <>
            <div style={S.desc}>
              {entry.description
                ? entry.description.slice(0, 120) + (entry.description.length > 120 ? '……' : '')
                : '暂无描述。'}
            </div>

            {entry.relations && Object.keys(entry.relations).length > 0 && (
              <div style={S.section}>
                <div style={S.sectionTitle}>关联</div>
                {Object.entries(entry.relations).map(([k, v]) => (
                  <div key={k} style={{ fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#5a6880' }}>{k}：</span>
                    <span style={{ color: '#8898b0' }}>{Array.isArray(v) ? v.join('、') : v}</span>
                  </div>
                ))}
              </div>
            )}

            <button style={S.linkBtn}
              onClick={() => onSwitchToBaodian && onSwitchToBaodian(node.baodianId)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(140,180,220,0.18)';
                e.currentTarget.style.borderColor = 'rgba(140,180,220,0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(120,160,200,0.1)';
                e.currentTarget.style.borderColor = 'rgba(120,160,200,0.2)';
              }}>
              查看完整词条 →
            </button>
          </>
        ) : (
          <div style={S.empty}>
            暂无百科词条<br />
            <span style={{ fontSize: '11px', color: '#3a4860' }}>
              可在 baodianData.js 中添加
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
