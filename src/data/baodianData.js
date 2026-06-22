/**
 * 修罗武神宇宙知识宝典 — 藏经阁数据层
 *
 * 各板块词条数据规范见下方注释。
 * 用户在此文件中直接编辑和新增词条。
 */

// ==================== 分类定义 ====================

export const CATEGORIES = [
  {
    key: '人物谱', label: '人物谱', icon: '☶',
  },
  {
    key: '势力录', label: '势力录', icon: '☳',
    sub: [
      { key: '宗门势力', label: '宗门势力' },
      { key: '种族势力', label: '种族势力' },
    ],
  },
  {
    key: '功法阁', label: '功法阁', icon: '☰',
    sub: [
      { key: '一段武技', label: '一段武技' },
      { key: '二段武技', label: '二段武技' },
      { key: '三段武技', label: '三段武技' },
      { key: '四段武技', label: '四段武技' },
      { key: '五段武技', label: '五段武技' },
      { key: '六段武技', label: '六段武技' },
      { key: '七段武技', label: '七段武技' },
      { key: '八段武技', label: '八段武技' },
      { key: '九段武技', label: '九段武技' },
      { key: '人禁', label: '人禁·禁忌武技' },
      { key: '地禁', label: '地禁·禁忌武技' },
      { key: '天禁', label: '天禁·禁忌武技' },
      { key: '祖禁', label: '祖禁·禁忌武技' },
      { key: '仙禁', label: '仙禁·禁忌武技' },
      { key: '尊禁', label: '尊禁·禁忌武技' },
      { key: '神禁', label: '神禁·禁忌武技' },
      { key: '秘法', label: '秘法' },
      { key: '神技', label: '神技' },
      { key: '一段仙法', label: '一段仙法' },
      { key: '二段仙法', label: '二段仙法' },
      { key: '三段仙法', label: '三段仙法' },
      { key: '四段仙法', label: '四段仙法' },
      { key: '五段仙法', label: '五段仙法' },
      { key: '六段仙法', label: '六段仙法' },
      { key: '七段仙法', label: '七段仙法' },
      { key: '八段仙法', label: '八段仙法' },
      { key: '九段仙法', label: '九段仙法' },
    ],
  },
  {
    key: '兵器谱', label: '兵器谱', icon: '☲',
    sub: [
      { key: '半成奇兵', label: '半成奇兵' },
      { key: '奇兵', label: '奇兵' },
      { key: '半成王兵', label: '半成王兵' },
      { key: '王兵', label: '王兵' },
      { key: '半成帝兵', label: '半成帝兵' },
      { key: '帝兵', label: '帝兵' },
      { key: '半成祖兵', label: '半成祖兵' },
      { key: '祖兵', label: '祖兵' },
      { key: '半成仙兵', label: '半成仙兵' },
      { key: '仙兵', label: '仙兵' },
      { key: '半成尊兵', label: '半成尊兵' },
      { key: '尊兵', label: '尊兵' },
      { key: '半成神兵', label: '半成神兵' },
      { key: '神兵', label: '神兵' },
    ],
  },
  {
    key: '血脉录', label: '血脉录', icon: '☵',
    sub: [
      { key: '天赐神体', label: '天赐神体' },
      { key: '皇级血脉', label: '皇级血脉' },
      { key: '帝级血脉', label: '帝级血脉' },
      { key: '天级血脉', label: '天级血脉' },
      { key: '结界血脉', label: '结界血脉' },
      { key: '种族血脉', label: '种族血脉' },
    ],
  },
  {
    key: '秘境志', label: '秘境志', icon: '☴',
    sub: [
      { key: '遗迹', label: '遗迹' },
      { key: '秘境', label: '秘境' },
      { key: '洞天福地', label: '洞天福地' },
    ],
  },
  {
    key: '编年史', label: '编年史', icon: '☷',
  },
];

// ==================== 词条数据 ====================

export const ENTRIES = {};

// ==================== 编年史阶段定义 ====================

export const CHRONICLE_STAGES = [
  { key: 'qingzhou',     name: '青州篇',       order: 1, description: '楚枫崛起于青州，以一人之力搅动九州风云。' },
  { key: 'jiuzhou',      name: '九州大陆篇',   order: 2, description: '踏足九州大陆，于万千天才中杀出一条血路。' },
  { key: 'dongfang',     name: '东方海域篇',   order: 3, description: '横渡东方海域，探寻更深远的武道之秘。' },
  { key: 'wuzhishengtu', name: '武之圣土篇',   order: 4, description: '入武之圣土，历尽磨砺，凡躯化圣。' },
  { key: 'zuwuxingyu',   name: '祖武星域篇',   order: 5, description: '冲出下界，登临祖武星域，崭露头角。' },
  { key: 'daqian',       name: '大千上界篇',   order: 6, description: '踏入大千上界，群雄逐鹿，步步登天。' },
  { key: 'shengguang',   name: '圣光天河篇',   order: 7, description: '圣光天河中纵横捭阖，威震诸天万界。' },
  { key: 'qijie',        name: '七界天河篇',   order: 8, description: '七界天河中再攀武道巅峰，证道永恒。' },
];

// ==================== 词条模板与规范 ====================

/**
 * 人物谱词条模板
 *
 * {
 *   id: 'chu-feng',
 *   name: '楚枫',
 *   category: '人物谱',
 *   tags: ['主角', '青龙宗'],
 *   description: '……',
 *   relations: {
 *     '境界': '武神',
 *     '势力': '青龙宗',
 *     '种族': '人族',
 *     '血脉': '修罗血脉',
 *     '神体': '修罗神体',
 *     '兵器': ['修罗剑'],
 *     '功法': ['修罗武神诀'],
 *     '重要经历': '……',
 *   },
 *   related: ['entry-id-2'],
 *   starNodeId: null,
 * }
 */

/**
 * 势力录词条模板
 *
 * {
 *   id: 'qinglong-zong',
 *   name: '青龙宗',
 *   category: '势力录',
 *   subcategory: '宗门势力',
 *   tags: ['东域'],
 *   description: '……',
 *   relations: {
 *     '所属天河': '图腾天河',
 *     '所属星域': '青龙星域',
 *     '势力等级': '帝级宗门',
 *     '核心人物': ['人物名'],
 *     '镇族功法': ['功法名'],
 *     '镇族兵器': ['兵器名'],
 *     '附属': ['附属势力名'],
 *     '敌对': ['敌对势力名'],
 *     '同盟': ['同盟势力名'],
 *   },
 *   related: ['entry-id'],
 *   starNodeId: null,
 * }
 */

/**
 * 功法阁词条模板
 *
 * {
 *   id: 'xiuluo-wushen-jue',
 *   name: '修罗武神诀',
 *   category: '功法阁',
 *   subcategory: '神技',       // 所属段位/类别
 *   skillBranch: '神技',       // 功法神树分支: '武技' | '禁忌武技' | '秘法·神技' | '仙法'
 *   skillTier: 0,              // 段位序号 (1-9, 0=无段位)
 *   tags: ['功法标签'],
 *   description: '……',
 *   relations: {
 *     '类型': '攻击型',
 *     '创造者': '修罗武神',
 *     '拥有者': ['楚枫'],
 *   },
 *   related: [],
 *   starNodeId: null,
 * }
 */

/**
 * 兵器谱词条模板
 *
 * {
 *   id: 'xiuluo-jian',
 *   name: '修罗剑',
 *   category: '兵器谱',
 *   subcategory: '神兵',       // 兵器等级分类
 *   tags: ['剑', '杀伐'],
 *   description: '……',
 *   relations: {
 *     '等级': '神兵',
 *     '拥有者': ['楚枫'],
 *     '关联势力': '青龙宗',
 *   },
 *   related: [],
 *   starNodeId: null,
 * }
 */

/**
 * 血脉录词条模板
 *
 * {
 *   id: 'xiuluo-xuemai',
 *   name: '修罗血脉',
 *   category: '血脉录',
 *   subcategory: '种族血脉',
 *   tags: ['血脉标签'],
 *   description: '……',
 *   relations: {
 *     '类型': '种族血脉',
 *     '拥有者': ['楚枫'],
 *     '能力': '……',
 *   },
 *   related: [],
 *   starNodeId: null,
 * }
 */

/**
 * 秘境志词条模板
 *
 * {
 *   id: 'tai-gu-yi-ji',
 *   name: '太古遗迹',
 *   category: '秘境志',
 *   subcategory: '遗迹',
 *   tags: ['太古'],
 *   description: '……',
 *   relations: {
 *     '所属天河': '圣光天河',
 *     '所属星域': '太古星域',
 *     '关联人物': ['楚枫'],
 *     '关联势力': '青龙宗',
 *     '主要机缘': ['修罗剑', '修罗武神诀'],
 *   },
 *   related: [],
 *   starNodeId: 'taigu',       // 与星图节点联动
 * }
 */

/**
 * 编年史事件模板
 *
 * {
 *   id: 'chronicle-qingzhou-01',
 *   name: '事件名称',
 *   category: '编年史',
 *   stage: 'qingzhou',         // CHRONICLE_STAGES 中的 key
 *   tags: ['事件标签'],
 *   description: '事件描述……',
 *   relations: {
 *     '关联人物': ['楚枫'],
 *     '关联势力': '青龙宗',
 *     '关联秘境': '太古遗迹',
 *   },
 *   related: [],
 * }
 */

// ==================== 工具函数 ====================

/** 获取各顶层分类的条目数量 */
export function getStats(entries) {
  const stats = {};
  for (const cat of CATEGORIES) {
    if (cat.key === '编年史') continue; // 编年史不计入统计卡片
    stats[cat.key] = 0;
  }
  for (const entry of Object.values(entries)) {
    const cat = entry.category;
    if (cat in stats) stats[cat]++;
  }
  return stats;
}

/** 按分类/子分类获取词条列表 */
export function getEntriesByCategory(entries, catKey, subKey) {
  const result = [];
  for (const [id, entry] of Object.entries(entries)) {
    if (subKey) {
      if (entry.subcategory === subKey) result.push({ id, ...entry });
    } else if (catKey) {
      if (entry.category === catKey) result.push({ id, ...entry });
    }
  }
  return result;
}

/** 提取势力关系图数据 */
export function getFactionGraphData(entries) {
  const factionEntries = Object.entries(entries)
    .filter(([, e]) => e.category === '势力录')
    .map(([id, e]) => ({ id, ...e }));

  if (factionEntries.length === 0) return { nodes: [], links: [] };

  const nodeMap = {};
  for (const fe of factionEntries) {
    nodeMap[fe.id] = { id: fe.id, name: fe.name, color: '#c4a86a' };
  }

  const links = [];
  const linkSet = new Set();

  for (const fe of factionEntries) {
    const rels = fe.relations || {};
    const addLinks = (names, type) => {
      if (!Array.isArray(names)) return;
      for (const name of names) {
        const target = factionEntries.find((f) => f.name === name);
        if (!target) continue;
        const key = [fe.id, target.id].sort().join('|') + '|' + type;
        if (linkSet.has(key)) continue;
        linkSet.add(key);
        links.push({ source: fe.id, target: target.id, type });
      }
    };
    addLinks(rels['同盟'], '同盟');
    addLinks(rels['敌对'], '敌对');
    addLinks(rels['附属'], '附属');

    const related = fe.related || [];
    for (const rid of related) {
      if (!nodeMap[rid]) continue;
      const key = [fe.id, rid].sort().join('|') + '|其他';
      if (linkSet.has(key)) continue;
      linkSet.add(key);
      links.push({ source: fe.id, target: rid, type: '其他' });
    }
  }

  return { nodes: Object.values(nodeMap), links };
}

/** 获取编年史事件（按阶段分组） */
export function getChronicleEvents(entries) {
  const events = Object.entries(entries)
    .filter(([, e]) => e.category === '编年史')
    .map(([id, e]) => ({ id, ...e }));

  const byStage = {};
  for (const evt of events) {
    const stage = evt.stage || 'other';
    if (!byStage[stage]) byStage[stage] = [];
    byStage[stage].push(evt);
  }
  return byStage;
}

/** 获取功法神树结构 */
export function getSkillTreeData(entries) {
  const skills = Object.entries(entries)
    .filter(([, e]) => e.category === '功法阁')
    .map(([id, e]) => ({ id, ...e }));

  // 四大分支
  const branches = {
    '武技': { label: '武技', icon: '⚔', children: {} },
    '禁忌武技': { label: '禁忌武技', icon: '⛧', children: {} },
    '秘法·神技': { label: '秘法·神技', icon: '✧', children: {} },
    '仙法': { label: '仙法', icon: '☬', children: {} },
  };

  for (const skill of skills) {
    const branch = skill.skillBranch || '武技';
    const sub = skill.subcategory || '其他';
    if (!branches[branch]) continue;
    if (!branches[branch].children[sub]) {
      branches[branch].children[sub] = [];
    }
    branches[branch].children[sub].push(skill);
  }

  return branches;
}
