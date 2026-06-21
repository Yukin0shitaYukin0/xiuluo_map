// ============================================================
// 武侠世界观 · 完整数据
// 层级：太古神域 → 天河 → 星域 → 上界/凡界/下界
// ============================================================

import { TIANHE_COLORS } from './colorSystem';
export { TIANHE_COLORS };

export const worldData = {
  taigu: {
    id: 'taigu',
    name: '太古神域',
    type: 'taigu',
  },

  tianhe: [
    // ==================== 东域 ====================
    {
      id: 'shengguang',
      name: '圣光天河',
      region: '东域',
      color: TIANHE_COLORS['圣光天河'],
      children: [
        { id: 'sg_mingyun',     name: '命运凡界', type: 'fanjie' },
        { id: 'sg_zixing',      name: '紫星上界', type: 'shangjie' },
        { id: 'sg_fenglei',     name: '风雷星域', type: 'xingyu', children: [] },
        { id: 'sg_xuanming',    name: '玄冥星域', type: 'xingyu', children: [] },
        {
          id: 'sg_zuwu_xingyu', name: '祖武星域', type: 'xingyu',
          children: [
            { id: 'sg_daqian', name: '大千上界', type: 'shangjie',
              children: [
                { id: 'sg_zishu',   name: '紫树凡界', type: 'fanjie' },
                { id: 'sg_bailian', name: '百炼凡界', type: 'fanjie',
                  children: [
                    { id: 'sg_zuwu_xiajie', name: '祖武下界', type: 'xiajie' },
                    { id: 'sg_huiye',       name: '辉夜下界', type: 'xiajie' },
                    { id: 'sg_yushu',       name: '榆树下界', type: 'xiajie' },
                  ]
                },
              ]
            },
            { id: 'sg_jiulong',       name: '九龙上界',   type: 'shangjie' },
            { id: 'sg_dali',          name: '大黎上界',   type: 'shangjie' },
            { id: 'sg_wanzhou',       name: '万州上界',   type: 'shangjie' },
            { id: 'sg_zhouzhi',       name: '昼之上界',   type: 'shangjie' },
            { id: 'sg_yucang',        name: '域苍上界',   type: 'shangjie' },
            { id: 'sg_fengping',      name: '封平上界',   type: 'shangjie' },
            { id: 'sg_guxi',          name: '孤溪上界',   type: 'shangjie' },
            { id: 'sg_jiuxuan',       name: '九玄上界',   type: 'shangjie' },
            { id: 'sg_linghu',        name: '令狐上界',   type: 'shangjie' },
            { id: 'sg_jinshi',        name: '金石上界',   type: 'shangjie' },
            { id: 'sg_chizhou',       name: '赤州上界',   type: 'shangjie' },
            { id: 'sg_xingyu_zhujie', name: '星域主界',   type: 'shangjie' },
          ]
        },
        {
          id: 'sg_zhutian', name: '诸天星域', type: 'xingyu',
          children: [
            { id: 'sg_zhutian_shangjie', name: '诸天上界', type: 'shangjie' },
            { id: 'sg_lunhui',           name: '轮回上界', type: 'shangjie' },
          ]
        },
        {
          id: 'sg_buxiu', name: '不朽星域', type: 'xingyu',
          children: [
            { id: 'sg_huahai', name: '花海凡界', type: 'fanjie' },
          ]
        },
        { id: 'sg_shengguang_xingyu', name: '圣光星域', type: 'xingyu', children: [] },
        {
          id: 'sg_tuteng_xingyu', name: '图腾星域', type: 'xingyu',
          children: [
            { id: 'sg_tx_yukong', name: '御空凡界', type: 'fanjie' },
            { id: 'sg_tx_xuemo',  name: '血漠上界', type: 'shangjie' },
          ]
        },
        { id: 'sg_tianmai',  name: '天脉星域', type: 'xingyu', children: [] },
        { id: 'sg_yaozu',    name: '妖族星域', type: 'xingyu', children: [] },
        { id: 'sg_wolong',   name: '卧龙星域', type: 'xingyu', children: [] },
        { id: 'sg_siwang',   name: '死亡星域', type: 'xingyu', children: [] },
        {
          id: 'sg_tuntian', name: '吞天星域', type: 'xingyu',
          children: [
            { id: 'sg_fengxian', name: '奉仙上界', type: 'shangjie' },
            { id: 'sg_tianlei',  name: '天雷上界', type: 'shangjie' },
          ]
        },
        { id: 'sg_feiyun',   name: '飞云星域', type: 'xingyu', children: [] },
        { id: 'sg_zuoqiu',   name: '左丘星域', type: 'xingyu', children: [] },
        { id: 'sg_kuangdao', name: '狂刀星域', type: 'xingyu', children: [] },
        { id: 'sg_lingzhou', name: '灵州星域', type: 'xingyu', children: [] },
      ]
    },
    {
      id: 'jiuhun',
      name: '九魂天河',
      region: '东域',
      color: TIANHE_COLORS['九魂天河'],
      children: [
        { id: 'hunyuan',         name: '魂怨凡界', type: 'fanjie' },
        { id: 'cangbao',         name: '藏宝凡界', type: 'fanjie' },
        { id: 'yaduo',           name: '亚朵上界', type: 'shangjie' },
        { id: 'xianquan',        name: '仙泉上界', type: 'shangjie' },
        { id: 'mingfeng',        name: '命峰上界', type: 'shangjie' },
        { id: 'tianxing',        name: '天侀上界', type: 'shangjie' },
        { id: 'jiuhun_shangjie', name: '九魂上界', type: 'shangjie' },
        { id: 'suxian',          name: '宿仙星域', type: 'xingyu', children: [] },
        {
          id: 'juluo', name: '聚落星域', type: 'xingyu',
          children: [
            { id: 'feisheng', name: '飞升上界', type: 'shangjie' },
          ]
        },
      ]
    },

    // ==================== 北域 ====================
    {
      id: 'tuteng',
      name: '图腾天河',
      region: '北域',
      color: TIANHE_COLORS['图腾天河'],
      children: [
        { id: 'yukong', name: '御空凡界', type: 'fanjie' },
        { id: 'xuemo',  name: '血漠上界', type: 'shangjie' },
        {
          id: 'zhenlong', name: '真龙星域', type: 'xingyu',
          children: [
            { id: 'moguan',             name: '魔棺凡界', type: 'fanjie' },
            { id: 'lingshou',           name: '灵兽上界', type: 'shangjie' },
            { id: 'zhenlong_shangjie',  name: '真龙上界', type: 'shangjie' },
            { id: 'ziyan',              name: '紫炎上界', type: 'shangjie' },
          ]
        },
        { id: 'kuan',    name: '苦岸星域', type: 'xingyu', children: [] },
        { id: 'qianyuan',name: '乾元星域', type: 'xingyu', children: [] },
        { id: 'jingmie', name: '镜灭星域', type: 'xingyu', children: [] },
      ]
    },
    {
      id: 'xianhai',
      name: '仙海天河',
      region: '北域',
      color: TIANHE_COLORS['仙海天河'],
      children: [
        { id: 'weiguang', name: '微光上界', type: 'shangjie' },
        { id: 'qingxue',  name: '青雪上界', type: 'shangjie' },
      ]
    },

    // ==================== 西域 ====================
    {
      id: 'xuemai',
      name: '血脉天河',
      region: '西域',
      color: TIANHE_COLORS['血脉天河'],
      children: [
        {
          id: 'ranmai', name: '燃脉星域', type: 'xingyu',
          children: [
            { id: 'ranmai_fanjie', name: '燃脉凡界', type: 'fanjie' },
          ]
        },
      ]
    },
    {
      id: 'cangqiong',
      name: '苍穹天河',
      region: '西域',
      color: TIANHE_COLORS['苍穹天河'],
      children: [
        {
          id: 'douzhan', name: '斗战星域', type: 'xingyu',
          children: [
            { id: 'xianjiang', name: '仙江上界', type: 'shangjie' },
          ]
        },
      ]
    },

    // ==================== 南域 ====================
    {
      id: 'qijie',
      name: '七界天河',
      region: '南域',
      color: TIANHE_COLORS['七界天河'],
      children: [
        { id: 'chunzhi', name: '春之上界', type: 'shangjie' },
        {
          id: 'jiuchuan', name: '九川星域', type: 'xingyu',
          children: [
            { id: 'tianyu', name: '天禹上界', type: 'shangjie' },
          ]
        },
      ]
    },
    {
      id: 'shenti',
      name: '神体天河',
      region: '南域',
      color: TIANHE_COLORS['神体天河'],
      children: [
        { id: 'jinchuan', name: '金川上界', type: 'shangjie' },
        { id: 'zunyuan',  name: '尊元上界', type: 'shangjie' },
        { id: 'pingyuan', name: '平渊上界', type: 'shangjie' },
      ]
    },
  ]
};

// ---------- 统计节点总数 ----------
export function countNodes(data) {
  let count = 1; // 太古神域
  function recurse(items) {
    if (!items) return;
    for (const item of items) {
      count++;
      if (item.children) recurse(item.children);
    }
  }
  for (const th of data.tianhe) {
    count++; // 天河本身
    if (th.children) recurse(th.children);
  }
  return count;
}

// ---------- 扁平化为列表 ----------
export function flattenNodes(data) {
  const nodes = [];

  nodes.push({
    id: data.taigu.id,
    name: data.taigu.name,
    type: 'taigu',
    parentTianhe: null,
    parentXingyu: null,
    depth: 0,
    tianheIndex: -1,
    color: '#fff4d0',
  });

  for (let ti = 0; ti < data.tianhe.length; ti++) {
    const th = data.tianhe[ti];
    nodes.push({
      id: th.id,
      name: th.name,
      type: 'tianhe',
      region: th.region,
      color: th.color,
      parentTianhe: th.name,
      parentXingyu: null,
      depth: 1,
      tianheIndex: ti,
    });

    function addChildren(children, depth, parentXingyu) {
      if (!children) return;
      for (const child of children) {
        nodes.push({
          id: child.id,
          name: child.name,
          type: child.type,
          color: th.color,
          parentTianhe: th.name,
          parentXingyu: child.type === 'xingyu' ? child.id : parentXingyu,
          depth,
          tianheIndex: ti,
        });
        if (child.children) {
          addChildren(
            child.children,
            depth + 1,
            child.type === 'xingyu' ? child.id : parentXingyu
          );
        }
      }
    }
    addChildren(th.children, 2, null);
  }

  return nodes;
}
