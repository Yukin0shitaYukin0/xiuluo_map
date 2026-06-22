/**
 * 宝典百科数据结构
 * 每一条词条包含名称、分类、标签、描述、关联信息。
 * 你可在此文件中直接编辑和新增词条。
 */

export const CATEGORIES = [
  {
    key: '人物谱',
    label: '人物谱',
    icon: '⚔',
  },
  {
    key: '势力录',
    label: '势力录',
    icon: '🏯',
    sub: [
      { key: '宗门', label: '宗门' },
      { key: '种族', label: '种族' },
    ],
  },
  {
    key: '功法阁',
    label: '功法阁',
    icon: '📜',
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
    key: '神兵录',
    label: '神兵录',
    icon: '🗡',
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
    key: '奇珍录',
    label: '奇珍录',
    icon: '💎',
    sub: [
      { key: '仙草', label: '仙草' },
      { key: '丹药', label: '丹药' },
      { key: '灵石', label: '灵石' },
      { key: '宝物', label: '宝物' },
    ],
  },
  {
    key: '秘境志',
    label: '秘境志',
    icon: '🏛',
    sub: [
      { key: '遗迹', label: '遗迹' },
      { key: '秘境', label: '秘境' },
      { key: '洞天福地', label: '洞天福地' },
    ],
  },
  {
    key: '血脉录',
    label: '血脉录',
    icon: '🩸',
    sub: [
      { key: '天赐神体', label: '天赐神体' },
      { key: '皇级血脉', label: '皇级血脉' },
      { key: '帝级血脉', label: '帝级血脉' },
      { key: '天级血脉', label: '天级血脉' },
      { key: '结界血脉', label: '结界血脉' },
      { key: '种族血脉', label: '种族血脉' },
    ],
  },
];

/**
 * 词条数据。entryId → 词条详情。
 * 每个词条可包含：
 *   id, name, category, subcategory, tags, description, relations, related, starNodeId
 */
export const ENTRIES = {};

/**
 * 示例词条（作为模板参考）
 */
export const ENTRY_TEMPLATE = {
  id: 'entry-id',              // 唯一标识
  name: '词条名称',             // 显示名称
  category: '人物谱',           // 所属大类（CATEGORIES 中的 key）
  subcategory: '宗门',          // 所属小类
  tags: ['标签1', '标签2'],     // 标签
  description: '描述内容……',    // 自由文本
  relations: {                 // 关联信息
    '势力': '青龙宗',
    '兵器': ['修罗剑'],
    '功法': ['修罗武神诀'],
    '血脉': '修罗血脉',
    '拥有者': '楚枫',
  },
  related: ['entry-id-2'],     // 关联词条 ID 列表
  starNodeId: null,            // 对应星图节点 ID（可选）
};
