import { useState, useMemo, useCallback, useEffect } from 'react';
import { CATEGORIES, ENTRIES } from '../data/baodianData';
import StarfieldBackground from './baodian/StarfieldBackground';
import SearchBar from './baodian/SearchBar';
import Sidebar from './baodian/Sidebar';
import HomePage from './baodian/HomePage';
import CardGrid from './baodian/CardGrid';
import EntryDetail from './baodian/EntryDetail';
import FactionDetail from './baodian/FactionDetail';
import { C, FONT } from './baodian/baodianStyles';
import { getStats, getEntriesByCategory, getFactionGraphData } from '../data/baodianData';

const S = {
  container: {
    width: '100vw', height: '100vh', background: C.bgDeepest,
    display: 'flex', color: C.textSecondary,
    fontFamily: FONT, position: 'relative', overflow: 'hidden',
  },
  mainCol: {
    flex: 1, display: 'flex', flexDirection: 'column',
    height: '100vh', overflow: 'hidden',
    position: 'relative', zIndex: 1,
    padding: '0 28px',
  },
  content: {
    flex: 1, overflowY: 'auto', overflowX: 'hidden',
  },
  tagOverflow: {
    fontSize: '11px', color: C.textMuted, lineHeight: '20px',
  },
};

export default function Baodian({ initialEntryId }) {
  const [activeCat, setActiveCat] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [activeEntryId, setActiveEntryId] = useState(initialEntryId || null);

  // 统计
  const stats = useMemo(() => getStats(ENTRIES), []);

  // 每个分类/子分类的条目计数
  const entryCounts = useMemo(() => {
    const c = {};
    for (const cat of CATEGORIES) {
      if (cat.sub) {
        c[cat.key] = cat.sub.reduce((sum, s) => sum + (getEntriesByCategory(ENTRIES, null, s.key).length), 0);
        for (const s of cat.sub) {
          c[s.key] = getEntriesByCategory(ENTRIES, null, s.key).length;
        }
      } else {
        c[cat.key] = getEntriesByCategory(ENTRIES, cat.key).length;
      }
    }
    return c;
  }, []);

  // 当前分类下的词条
  const categoryEntries = useMemo(() => {
    return getEntriesByCategory(ENTRIES, activeSub ? null : activeCat, activeSub);
  }, [activeCat, activeSub]);

  // 势力关系图数据
  const factionGraphData = useMemo(() => getFactionGraphData(ENTRIES), []);

  // 当前选中词条
  const currentEntry = activeEntryId ? ENTRIES[activeEntryId] : null;

  // 当 initialEntryId 变化时（从星图跳转），选中对应词条
  useEffect(() => {
    if (initialEntryId) {
      setActiveEntryId(initialEntryId);
      // 找到该词条所属分类并展开
      const entry = ENTRIES[initialEntryId];
      if (entry) {
        setActiveCat(entry.category);
        if (entry.subcategory) setActiveSub(entry.subcategory);
      }
    }
  }, [initialEntryId]);

  const handleSelectCat = useCallback((catKey) => {
    const cat = CATEGORIES.find((c) => c.key === catKey);
    if (cat && cat.sub && cat.sub.length > 0) {
      // 有子分类：切换展开/收起
      setActiveCat((prev) => prev === catKey ? null : catKey);
      setActiveSub(null);
    } else if (cat) {
      // 无子分类（如人物谱）：直接选中
      setActiveCat((prev) => prev === catKey ? null : catKey);
      setActiveSub(null);
    }
    setActiveEntryId(null);
  }, []);

  const handleSelectSub = useCallback((subKey) => {
    setActiveSub((prev) => prev === subKey ? null : subKey);
    setActiveEntryId(null);
  }, []);

  const handleSelectEntry = useCallback((entryId) => {
    setActiveEntryId(entryId);
  }, []);

  const handleBack = useCallback(() => {
    setActiveEntryId(null);
  }, []);

  // ============ 内容区渲染 ============
  const renderContent = () => {
    // 1. 查看词条详情
    if (currentEntry) {
      if (currentEntry.category === '势力录') {
        return (
          <FactionDetail
            entry={currentEntry}
            allFactions={getEntriesByCategory(ENTRIES, '势力录')}
            graphData={factionGraphData}
            onBack={handleBack}
            onSelectEntry={handleSelectEntry}
          />
        );
      }
      return (
        <EntryDetail
          entry={currentEntry}
          onBack={handleBack}
          onSelectEntry={handleSelectEntry}
        />
      );
    }

    // 2. 选中了分类/子分类 → 显示卡片列表
    if (activeSub || activeCat) {
      const title = activeSub || activeCat;
      return (
        <CardGrid
          title={title}
          entries={categoryEntries}
          category={activeCat}
          onSelectEntry={handleSelectEntry}
        />
      );
    }

    // 3. 首页
    return <HomePage stats={stats} onSelectCat={handleSelectCat} />;
  };

  return (
    <div style={S.container}>
      <StarfieldBackground />
      <Sidebar
        categories={CATEGORIES}
        activeCat={activeCat}
        activeSub={activeSub}
        onSelectCat={handleSelectCat}
        onSelectSub={handleSelectSub}
        entryCounts={entryCounts}
      />
      <div style={S.mainCol}>
        <SearchBar entries={ENTRIES} onSelectEntry={handleSelectEntry} />
        <div style={S.content}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
