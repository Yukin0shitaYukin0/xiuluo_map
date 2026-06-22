import { getNodeColor } from './colorSystem';

const LEVEL = { taigu: 0, tianhe: 1, xingyu: 2, shangjie: 3, fanjie: 3, xiajie: 4 };

export function spiralWind(r) {
  return Math.max(0, r - 5) / 48 * 2.0;
}

function typeColor(type, tianheColor) {
  return getNodeColor(type, tianheColor);
}

export function buildRelationshipMap(worldData) {
  const nodeMap = {};
  const parentMap = {};
  const childrenMap = {};

  function ensure(id, name, type, tianheColor) {
    if (!nodeMap[id]) nodeMap[id] = { id, name, type, color: typeColor(type, tianheColor), tianheColor };
  }
  function addChild(parentId, childId) {
    if (!childrenMap[parentId]) childrenMap[parentId] = [];
    childrenMap[parentId].push(childId);
    parentMap[childId] = parentId;
  }

  const taigu = worldData.taigu;
  ensure(taigu.id, taigu.name, taigu.type, null);

  for (const th of worldData.tianhe) {
    ensure(th.id, th.name, 'tianhe', th.color);
    addChild(taigu.id, th.id);

    function walk(children, parentId) {
      if (!children) return;
      for (const child of children) {
        ensure(child.id, child.name, child.type, th.color);
        addChild(parentId, child.id);
        if (child.children) walk(child.children, child.id);
      }
    }
    walk(th.children, th.id);
  }

  return { parentMap, childrenMap, nodeMap };
}

function collectSubtreeLines(rootId, childrenMap, lines) {
  const kids = childrenMap[rootId];
  if (!kids) return;
  for (const kidId of kids) {
    lines.push({ from: rootId, to: kidId });
    collectSubtreeLines(kidId, childrenMap, lines);
  }
}

export function getConnectionLines(selectedNodeId, relMap) {
  const { parentMap, childrenMap, nodeMap } = relMap;
  const node = nodeMap[selectedNodeId];
  if (!node) return [];

  const lines = [];

  if (node.type === 'tianhe') {
    collectSubtreeLines(selectedNodeId, childrenMap, lines);
  } else if (node.type === 'taigu') {
    // 太古神域不显示与天河的连线
  } else {
    const parentId = parentMap[selectedNodeId];
    if (parentId && nodeMap[parentId] && nodeMap[parentId].type !== 'taigu') {
      lines.push({ from: parentId, to: selectedNodeId });
    }
    collectSubtreeLines(selectedNodeId, childrenMap, lines);
  }

  return lines;
}

export function getConnectionColor(id1, id2, nodeMap) {
  const n1 = nodeMap[id1];
  const n2 = nodeMap[id2];
  if (!n1 || !n2) return '#d8c89a';

  const l1 = LEVEL[n1.type] ?? 5;
  const l2 = LEVEL[n2.type] ?? 5;

  if (l1 > l2) return n1.color;
  return n2.color;
}

/** 获取全部父子连线（始终可见模式用） */
export function getAllConnectionLines(worldData, positions) {
  const { parentMap, childrenMap, nodeMap } = buildRelationshipMap(worldData);
  const lines = [];
  for (const [parentId, children] of Object.entries(childrenMap)) {
    for (const childId of children) {
      if (parentId === 'taigu') continue; // 隐藏太古→天河连线
      const fromPos = positions[parentId];
      const toPos = positions[childId];
      if (!fromPos || !toPos) continue;
      lines.push({
        key: `${parentId}→${childId}`,
        from: parentId,
        to: childId,
        fromPos,
        toPos,
        color: getConnectionColor(parentId, childId, nodeMap),
      });
    }
  }
  return lines;
}

/** 获取与选中节点相关的连线 key 集合 */
export function getRelatedLineSet(selectedNodeId, relMap) {
  const { parentMap, childrenMap } = relMap;
  const set = new Set();
  if (parentMap[selectedNodeId]) {
    set.add(`${parentMap[selectedNodeId]}→${selectedNodeId}`);
  }
  const children = childrenMap[selectedNodeId] || [];
  for (const childId of children) {
    set.add(`${selectedNodeId}→${childId}`);
  }
  return set;
}
