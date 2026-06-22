import { useState, useMemo, useCallback, useEffect } from 'react';
import { CATEGORIES, ENTRIES, getStats, getEntriesByCategory, getFactionGraphData, getChronicleEvents, getSkillTreeData } from '../data/baodianData';
import { C, FONT_BODY } from './baodian/codexStyles';
import CodexBackground from './baodian/CodexBackground';
import CodexSidebar from './baodian/CodexSidebar';
import SearchBar from './baodian/SearchBar';
import HomePage from './baodian/HomePage';
import CardGrid from './baodian/CardGrid';
import EntryDetail from './baodian/EntryDetail';
import PersonCard from './baodian/PersonCard';
import PersonDetail from './baodian/PersonDetail';
import FactionCard from './baodian/FactionCard';
import FactionDetail from './baodian/FactionDetail';
import SkillTree from './baodian/SkillTree';
import SkillTreeDetail from './baodian/SkillTreeDetail';
import Armory from './baodian/Armory';
import ArmoryDetail from './baodian/ArmoryDetail';
import BloodlineMap from './baodian/BloodlineMap';
import Chronicle from './baodian/Chronicle';
import RealmCard from './baodian/RealmCard';

const S = {
  container: {
    width: '100vw', height: '100vh', background: C.bgBlack,
    display: 'flex', color: C.textSecondary,
    fontFamily: FONT_BODY, position: 'relative', overflow: 'hidden',
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
};

export default function Baodian({ initialEntryId, onViewInStarMap }) {
  const [activeCat, setActiveCat] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [activeEntryId, setActiveEntryId] = useState(initialEntryId || null);

  // 统计
  const stats = useMemo(() => getStats(ENTRIES), []);

  // 条目计数
  const entryCounts = useMemo(() => {
    const c = {};
    for (const cat of CATEGORIES) {
      if (cat.sub) {
        c[cat.key] = cat.sub.reduce((sum, s) => sum + getEntriesByCategory(ENTRIES, null, s.key).length, 0);
        for (const s of cat.sub) {
          c[s.key] = getEntriesByCategory(ENTRIES, null, s.key).length;
        }
      } else {
        c[cat.key] = getEntriesByCategory(ENTRIES, cat.key).length;
      }
    }
    return c;
  }, []);

  // 当前分类词条
  const categoryEntries = useMemo(() => {
    return getEntriesByCategory(ENTRIES, activeSub ? null : activeCat, activeSub);
  }, [activeCat, activeSub]);

  // 派生数据
  const factionGraphData = useMemo(() => getFactionGraphData(ENTRIES), []);
  const chronicleEvents = useMemo(() => getChronicleEvents(ENTRIES), []);
  const skillTreeData = useMemo(() => getSkillTreeData(ENTRIES), []);

  // 当前词条
  const currentEntry = activeEntryId ? ENTRIES[activeEntryId] : null;

  // 从星图跳转时自动定位
  useEffect(() => {
    if (initialEntryId && ENTRIES[initialEntryId]) {
      setActiveEntryId(initialEntryId);
      const entry = ENTRIES[initialEntryId];
      setActiveCat(entry.category);
      if (entry.subcategory) setActiveSub(entry.subcategory);
    }
  }, [initialEntryId]);

  // ============ Handlers ============
  const handleSelectCat = useCallback((catKey) => {
    const cat = CATEGORIES.find((c) => c.key === catKey);
    if (cat && cat.sub && cat.sub.length > 0) {
      setActiveCat((prev) => prev === catKey ? null : catKey);
      setActiveSub(null);
    } else if (cat) {
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

  const handleBloodlineSelect = useCallback((entryId, cat, sub) => {
    if (sub) {
      setActiveCat('血脉录');
      setActiveSub(sub);
      setActiveEntryId(null);
    } else if (entryId) {
      setActiveEntryId(entryId);
    }
  }, []);

  // ============ 渲染 ============
  const renderContent = () => {
    // 1. 词条详情
    if (currentEntry) {
      if (currentEntry.category === '势力录') {
        return (
          <FactionDetail entry={currentEntry} allFactions={getEntriesByCategory(ENTRIES, '势力录')}
            graphData={factionGraphData} onBack={handleBack} onSelectEntry={handleSelectEntry} />
        );
      }
      if (currentEntry.category === '人物谱') {
        return (
          <PersonDetail entry={currentEntry} graphData={null}
            onBack={handleBack} onSelectEntry={handleSelectEntry} />
        );
      }
      if (currentEntry.category === '功法阁') {
        return <SkillTreeDetail skill={currentEntry} onBack={handleBack} />;
      }
      if (currentEntry.category === '兵器谱') {
        return <ArmoryDetail weapon={currentEntry} onBack={handleBack} />;
      }
      // 通用详情（秘境志等）
      return <EntryDetail entry={currentEntry} onBack={handleBack} onSelectEntry={handleSelectEntry} />;
    }

    // 2. 编年史 — 特殊全页视图
    if (activeCat === '编年史') {
      return <Chronicle eventsByStage={chronicleEvents} onSelectEntry={handleSelectEntry} />;
    }

    // 3. 功法阁 — 功法神树
    if (activeCat === '功法阁' && !activeSub) {
      return <SkillTree skillTreeData={skillTreeData}
        onSelectSkill={handleSelectEntry} />;
    }

    // 4. 兵器谱 — 陈列馆
    if (activeCat === '兵器谱' && !activeSub) {
      return <Armory entries={getEntriesByCategory(ENTRIES, '兵器谱')}
        onSelectWeapon={handleSelectEntry} />;
    }

    // 5. 血脉录 — 血脉星图
    if (activeCat === '血脉录' && !activeSub) {
      return <BloodlineMap entries={getEntriesByCategory(ENTRIES, '血脉录')}
        onSelectEntry={handleBloodlineSelect} />;
    }

    // 6. 选中分类/子分类 — 卡片列表
    if (activeSub || activeCat) {
      const title = activeSub || activeCat;

      // 人物谱 — 专用人物卡片
      if (activeCat === '人物谱' || (activeCat === '势力录' && activeSub)) {
        const isPerson = activeCat === '人物谱';
        return (
          <div style={{ padding: '16px 0', height: '100%', overflowY: 'auto' }}>
            <div style={{
              fontFamily: '"STKaiti","KaiTi",serif', fontSize: '18px',
              color: C.gold, marginBottom: '16px', letterSpacing: '0.06em',
              paddingBottom: '6px', borderBottom: `1px solid ${C.borderSubtle}`,
            }}>{title}</div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '12px',
            }}>
              {categoryEntries.length === 0 ? (
                <div style={{ color: C.textMuted, fontSize: '13px', gridColumn: '1/-1', textAlign: 'center', padding: '40px 0' }}>
                  暂无词条，待修行者录入……
                </div>
              ) : (
                categoryEntries.map((entry) =>
                  isPerson ? (
                    <PersonCard key={entry.id} entry={entry}
                      onClick={handleSelectEntry} />
                  ) : (
                    <FactionCard key={entry.id} entry={entry}
                      onClick={handleSelectEntry} />
                  )
                )
              )}
            </div>
          </div>
        );
      }

      // 秘境志 — RealmCard
      if (activeCat === '秘境志') {
        return (
          <div style={{ padding: '16px 0', height: '100%', overflowY: 'auto' }}>
            <div style={{
              fontFamily: '"STKaiti","KaiTi",serif', fontSize: '18px',
              color: C.gold, marginBottom: '16px', letterSpacing: '0.06em',
              paddingBottom: '6px', borderBottom: `1px solid ${C.borderSubtle}`,
            }}>{title}</div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '12px',
            }}>
              {categoryEntries.length === 0 ? (
                <div style={{ color: C.textMuted, fontSize: '13px', gridColumn: '1/-1', textAlign: 'center', padding: '40px 0' }}>
                  诸天秘境，待修行者录入……
                </div>
              ) : (
                categoryEntries.map((entry) => (
                  <RealmCard key={entry.id} entry={entry}
                    onClick={handleSelectEntry}
                    onViewInStarMap={onViewInStarMap} />
                ))
              )}
            </div>
          </div>
        );
      }

      // 功法阁/兵器谱/血脉录 子分类 → 通用卡片
      return <CardGrid title={title} entries={categoryEntries}
        category={activeCat} onSelectEntry={handleSelectEntry} />;
    }

    // 7. 首页
    return <HomePage stats={stats} onSelectCat={handleSelectCat} />;
  };

  return (
    <div style={S.container}>
      <CodexBackground />
      <CodexSidebar
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
