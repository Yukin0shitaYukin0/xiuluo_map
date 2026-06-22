import { useState, useMemo } from 'react';
import { CATEGORIES, ENTRIES } from '../data/baodianData';

const S = {
  container: {
    width: '100vw', height: '100vh', background: '#0a0e17',
    display: 'flex', color: '#c8ccd4',
    fontFamily: '"Noto Serif SC", "SimSun", "STSong", serif',
  },
  sidebar: {
    width: '240px', minWidth: '240px', height: '100vh',
    background: 'rgba(16,20,32,0.95)', borderRight: '1px solid rgba(120,140,180,0.12)',
    overflowY: 'auto', padding: '0',
  },
  sidebarTitle: {
    padding: '20px 16px 12px',
    fontSize: '14px', color: '#8894b0', letterSpacing: '0.1em',
    borderBottom: '1px solid rgba(120,140,180,0.08)',
    marginBottom: '4px',
  },
  catBtn: (active) => ({
    display: 'flex', alignItems: 'center', gap: '8px',
    width: '100%', border: 'none', background: active ? 'rgba(120,160,200,0.1)' : 'transparent',
    color: active ? '#c8d8f0' : '#7888a0', fontSize: '13px',
    padding: '9px 16px', cursor: 'pointer', textAlign: 'left',
    fontFamily: 'inherit', transition: 'all 0.2s',
    borderLeft: active ? '2px solid #8098c0' : '2px solid transparent',
  }),
  subBtn: (active) => ({
    display: 'block', width: '100%', border: 'none',
    background: active ? 'rgba(120,160,200,0.08)' : 'transparent',
    color: active ? '#b8c8e0' : '#5a6880', fontSize: '12px',
    padding: '6px 16px 6px 36px', cursor: 'pointer', textAlign: 'left',
    fontFamily: 'inherit',
  }),
  main: {
    flex: 1, height: '100vh', overflowY: 'auto',
    padding: '32px 40px',
  },
  backBtn: {
    background: 'none', border: 'none', color: '#6a7a99', cursor: 'pointer',
    fontSize: '13px', fontFamily: 'inherit', padding: 0, marginBottom: '16px',
  },
  entryTitle: {
    fontSize: '28px', color: '#e0e4f0', fontWeight: 700,
    marginBottom: '8px', letterSpacing: '0.05em',
  },
  metaTags: {
    display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px',
  },
  tag: {
    fontSize: '11px', padding: '2px 10px', background: 'rgba(120,160,200,0.12)',
    borderRadius: '3px', color: '#8098b0',
  },
  sectionTitle: {
    fontSize: '14px', color: '#8894a8', fontWeight: 600,
    marginBottom: '8px', marginTop: '24px',
    borderBottom: '1px solid rgba(120,140,180,0.08)',
    paddingBottom: '4px',
  },
  desc: {
    fontSize: '14px', lineHeight: '1.9', color: '#a0aab8',
  },
  relItem: {
    fontSize: '13px', color: '#8894a8', marginBottom: '4px',
  },
  relKey: { color: '#5a6880' },
  relValue: { color: '#a0b8d0', marginLeft: '6px' },
  entryList: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
  },
  entryCard: {
    padding: '16px', background: 'rgba(16,22,38,0.8)',
    border: '1px solid rgba(120,140,180,0.08)',
    borderRadius: '6px', cursor: 'pointer',
    fontSize: '14px', color: '#b8c8e0',
    transition: 'border-color 0.2s',
  },
  empty: {
    fontSize: '14px', color: '#4a5870',
    padding: '60px 0', textAlign: 'center',
  },
  sectionHeader: {
    fontSize: '22px', color: '#d0d8e8', fontWeight: 600,
    marginBottom: '24px', letterSpacing: '0.05em',
  },
};

function EntryDetail({ entry, onBack }) {
  const rels = entry.relations || {};
  const hasRels = Object.keys(rels).length > 0;

  return (
    <div>
      <button style={S.backBtn} onClick={onBack}>← 返回列表</button>
      <h1 style={S.entryTitle}>{entry.name}</h1>
      <div style={S.metaTags}>
        <span style={S.tag}>{entry.category}</span>
        {entry.subcategory && <span style={S.tag}>{entry.subcategory}</span>}
        {entry.tags && entry.tags.map((t, i) => <span key={i} style={S.tag}>{t}</span>)}
      </div>

      <div style={S.desc}>
        {entry.description || '暂无描述，待补充。'}
      </div>

      {hasRels && (
        <>
          <h3 style={S.sectionTitle}>关联信息</h3>
          {Object.entries(rels).map(([k, v]) => (
            <div key={k} style={S.relItem}>
              <span style={S.relKey}>{k}：</span>
              <span style={S.relValue}>{Array.isArray(v) ? v.join('、') : v}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default function Baodian({ initialEntryId }) {
  const [activeCat, setActiveCat] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [activeEntry, setActiveEntry] = useState(initialEntryId || null);

  // 按分类整理词条
  const entriesByCat = useMemo(() => {
    const map = {};
    for (const [id, entry] of Object.entries(ENTRIES)) {
      const key = entry.subcategory || entry.category;
      if (!map[key]) map[key] = [];
      map[key].push({ id, ...entry });
    }
    return map;
  }, []);

  const categoryEntries = useMemo(() => {
    const key = activeSub || activeCat;
    if (!key) return [];
    return entriesByCat[key] || [];
  }, [activeSub, activeCat, entriesByCat]);

  const handleCatClick = (catKey) => {
    const cat = CATEGORIES.find(c => c.key === catKey);
    if (cat && cat.sub) {
      // 有子类，展开子类列表
      if (activeCat === catKey) {
        setActiveCat(null);
        setActiveSub(null);
      } else {
        setActiveCat(catKey);
        setActiveSub(null);
      }
    } else if (cat) {
      setActiveCat(catKey);
      setActiveSub(null);
    }
  };

  const handleSubClick = (subKey) => {
    setActiveSub(subKey);
  };

  const handleEntryClick = (entryId) => {
    setActiveEntry(entryId);
  };

  const handleBack = () => {
    setActiveEntry(null);
  };

  // 显示具体词条内容
  if (activeEntry && ENTRIES[activeEntry]) {
    return (
      <div style={S.container}>
        <div style={S.sidebar}>
          {CATEGORIES.map((cat) => (
            <button key={cat.key} style={S.catBtn(activeCat === cat.key)}
              onClick={() => handleCatClick(cat.key)}>
              <span>{cat.icon || ''}</span>
              {cat.label}
            </button>
          ))}
        </div>
        <div style={S.main}>
          <EntryDetail entry={ENTRIES[activeEntry]} onBack={handleBack} />
        </div>
      </div>
    );
  }

  return (
    <div style={S.container}>
      {/* 左侧分类栏 */}
      <div style={S.sidebar}>
        {CATEGORIES.map((cat) => (
          <div key={cat.key}>
            <button style={S.catBtn(activeCat === cat.key)}
              onClick={() => handleCatClick(cat.key)}>
              <span>{cat.icon || ''}</span>
              {cat.label}
            </button>
            {cat.sub && activeCat === cat.key && (
              <div>
                {cat.sub.map((s) => (
                  <button key={s.key} style={S.subBtn(activeSub === s.key)}
                    onClick={() => handleSubClick(s.key)}>
                    {s.label}
                    {entriesByCat[s.key] && (
                      <span style={{ marginLeft: '6px', color: '#404860', fontSize: '11px' }}>
                        ({entriesByCat[s.key].length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 右侧内容区 */}
      <div style={S.main}>
        {(activeSub || activeCat) ? (
          <>
            <h2 style={S.sectionHeader}>
              {activeSub || activeCat}
            </h2>
            {categoryEntries.length > 0 ? (
              <div style={S.entryList}>
                {categoryEntries.map((entry) => (
                  <div key={entry.id} style={S.entryCard}
                    onClick={() => handleEntryClick(entry.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(140,170,220,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(120,140,180,0.08)';
                    }}>
                    {entry.name}
                    <div style={{ fontSize: '11px', color: '#485060', marginTop: '4px' }}>
                      {entry.tags && entry.tags.join(' · ')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={S.empty}>
                暂无词条，请在 baodianData.js 中添加
              </div>
            )}
          </>
        ) : (
          <div style={S.empty}>
            请在左侧选择分类浏览
          </div>
        )}
      </div>
    </div>
  );
}
