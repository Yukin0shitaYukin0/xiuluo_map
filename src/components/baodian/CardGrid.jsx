import { C, FONT_BODY } from './codexStyles';
import EntryCard from './EntryCard';
import FactionCard from './FactionCard';

const S = {
  container: {
    flex: 1, overflowY: 'auto',
    padding: '20px 0',
  },
  header: {
    fontSize: '16px', color: C.textPrimary, fontWeight: 600,
    marginBottom: '20px', letterSpacing: '0.04em',
    paddingBottom: '8px',
    borderBottom: `1px solid ${C.borderSubtle}`,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '14px',
  },
  empty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '80px 0',
    color: C.textMuted, fontSize: '14px', fontFamily: FONT_BODY,
  },
  emptyIcon: {
    fontSize: '40px', marginBottom: '12px', opacity: 0.4,
  },
};

export default function CardGrid({ title, entries, category, onSelectEntry }) {
  const isFaction = category === '势力录';

  if (!entries || entries.length === 0) {
    return (
      <div style={S.container}>
        <div style={S.empty}>
          <div style={S.emptyIcon}>✦</div>
          <div>暂无词条，等待修行者录入……</div>
          <div style={{ fontSize: '11px', color: '#3a4860', marginTop: '6px' }}>
            可在 baodianData.js 中添加
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.container}>
      {title && <div style={S.header}>{title}</div>}
      <div style={S.grid}>
        {entries.map((entry) =>
          isFaction ? (
            <FactionCard key={entry.id} entry={entry}
              onClick={() => onSelectEntry && onSelectEntry(entry.id)} />
          ) : (
            <EntryCard key={entry.id} entry={entry}
              onClick={() => onSelectEntry && onSelectEntry(entry.id)} />
          )
        )}
      </div>
    </div>
  );
}
