import { C, FONT_BODY, FONT_TITLE, TRANS } from './codexStyles';

const S = {
  wrapper: {
    padding: '16px 0', height: '100%', overflowY: 'auto',
  },
  title: {
    fontFamily: FONT_TITLE, fontSize: '20px', color: C.gold,
    marginBottom: '20px', letterSpacing: '0.06em',
  },
  map: {
    position: 'relative', width: '100%', maxWidth: '600px',
    minHeight: '420px', margin: '0 auto',
  },
  node: (color) => ({
    position: 'absolute',
    width: '100px', padding: '10px 0',
    textAlign: 'center',
    background: 'rgba(13,15,20,0.85)',
    border: `1px solid ${color}33`,
    borderRadius: '50%',
    cursor: 'pointer',
    transition: TRANS,
    fontFamily: FONT_BODY, fontSize: '12px',
    color: C.textSecondary,
    transform: 'translate(-50%, -50%)',
  }),
  nodeCount: {
    fontSize: '18px', fontWeight: 700, color: C.goldDim,
    display: 'block',
  },
  nodeLabel: {
    fontSize: '10px', color: C.textMuted, marginTop: '2px',
  },
  empty: {
    color: C.textMuted, fontSize: '13px', textAlign: 'center',
    padding: '40px 0',
  },
};

const BLOODLINE_POSITIONS = [
  { key: '天赐神体',     x: 50, y: 18, color: '#dcc890' },
  { key: '皇级血脉',     x: 78, y: 38, color: '#c4a86a' },
  { key: '帝级血脉',     x: 78, y: 62, color: '#b8a080' },
  { key: '天级血脉',     x: 50, y: 82, color: '#9e8a5e' },
  { key: '结界血脉',     x: 22, y: 62, color: '#8b7355' },
  { key: '种族血脉',     x: 22, y: 38, color: '#a04040' },
];

export default function BloodlineMap({ entries, onSelectEntry }) {
  const countBySub = {};
  for (const entry of (entries || [])) {
    const sub = entry.subcategory || '其他';
    countBySub[sub] = (countBySub[sub] || 0) + 1;
  }

  const total = entries ? entries.length : 0;

  return (
    <div style={S.wrapper}>
      <div style={S.title}>血脉星图</div>
      {total === 0 ? (
        <div style={S.empty}>万般血脉，静待录入……</div>
      ) : (
        <div style={S.map}>
          {/* 连线 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {BLOODLINE_POSITIONS.map((p, i) =>
              BLOODLINE_POSITIONS.map((q, j) => {
                if (j <= i) return null;
                return (
                  <line key={`${i}-${j}`}
                    x1={`${p.x}%`} y1={`${p.y}%`}
                    x2={`${q.x}%`} y2={`${q.y}%`}
                    stroke="rgba(196,168,106,0.12)" strokeWidth="0.5" />
                );
              })
            )}
          </svg>

          {/* 节点 */}
          {BLOODLINE_POSITIONS.map((pos) => {
            const count = countBySub[pos.key] || 0;
            const entriesInGroup = (entries || []).filter((e) => e.subcategory === pos.key);
            return (
              <div key={pos.key} style={{
                ...S.node(pos.color),
                left: `${pos.x}%`, top: `${pos.y}%`,
              }}
              onClick={() => {
                if (entriesInGroup.length === 0) return;
                // 点击跳转到该子分类列表
                onSelectEntry && onSelectEntry(null, null, pos.key);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = pos.color + '88';
                e.currentTarget.style.boxShadow = `0 0 16px ${pos.color}22`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = pos.color + '33';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <span style={S.nodeCount}>{count}</span>
                <span style={S.nodeLabel}>{pos.key}</span>
              </div>
            );
          })}

          {/* 中心标注 */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center', pointerEvents: 'none',
          }}>
            <div style={{ fontSize: '28px', color: C.goldDim + '44' }}>☵</div>
            <div style={{ fontSize: '10px', color: C.textMuted }}>血脉</div>
          </div>
        </div>
      )}
    </div>
  );
}
