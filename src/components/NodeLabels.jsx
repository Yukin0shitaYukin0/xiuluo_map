import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import { buildRelationshipMap } from '../data/relationshipUtils';

const LABEL_OFFSET = { taigu: 1.8, tianhe: 1.5, xingyu: 1.0, shangjie: 0.7, fanjie: 0.6, xiajie: 0.5 };

const FONT_SIZE = {
  taigu: 0.5,
  tianhe: 1.2,
  xingyu: 0.6,
  shangjie: 0.22,
  fanjie: 0.22,
  xiajie: 0.22,
};

function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h;
}

const RENDER_ORDER = { taigu: 10, tianhe: 10, xingyu: 10, shangjie: 10, fanjie: 10, xiajie: 10 };

function FlowingLabel({ name, position, color, fontSize, baseOpacity, progress, outlineWidth = 0.04, renderOrder = 1 }) {
  const textRef = useRef();
  const phase = useMemo(() => Math.abs(hashString(name)) % 1000 / 1000 * Math.PI * 2, [name]);

  useEffect(() => {
    if (!textRef.current) return;
    textRef.current.renderOrder = renderOrder;
  }, [renderOrder]);

  useFrame((state) => {
    if (!textRef.current) return;
    const t = state.clock.elapsedTime;
    const wave = 0.6 + 0.4 * Math.sin(t * 1.8 + phase);
    const opacity = progress * baseOpacity * wave;
    // 遍历所有子网格，troika 异步创建 mesh，需要每帧强制设置
    textRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.renderOrder = renderOrder;
        child.material.renderOrder = renderOrder;
        child.material.depthTest = false;
        child.material.depthWrite = false;
        child.material.opacity = opacity;
        child.material.transparent = true;
      }
    });
    if (textRef.current.material) {
      textRef.current.material.opacity = opacity;
      textRef.current.material.depthTest = false;
      textRef.current.material.depthWrite = false;
      textRef.current.renderOrder = renderOrder;
      textRef.current.material.renderOrder = renderOrder;
    }
    textRef.current.renderOrder = renderOrder;
  });

  return (
    <Billboard position={position}>
      <Text ref={textRef} fontSize={fontSize} color={color}
        anchorX="center" anchorY="bottom"
        transparent depthTest={false}
        outlineWidth={outlineWidth}
        outlineColor="rgba(0,0,0,0.35)"
        renderOrder={renderOrder}
      >
        {name}
      </Text>
    </Billboard>
  );
}

export default function NodeLabels({ selectedNodeId, positions, worldData }) {
  const relMap = useMemo(() => buildRelationshipMap(worldData), [worldData]);
  const animRef = useRef(0);

  const labels = useMemo(() => {
    if (!selectedNodeId) return [];
    const { nodeMap, childrenMap, parentMap } = relMap;
    const node = nodeMap[selectedNodeId];
    if (!node) return [];

    const result = [];

    // 自身（天河已有固定标签，跳过）
    if (node.type !== 'tianhe') {
      const selfPos = positions[selectedNodeId];
      if (selfPos) {
        result.push({
          id: selectedNodeId,
          name: node.name,
          pos: selfPos,
          type: node.type,
          isSelf: true,
        });
      }
    }

    // 上一级（父节点），跳过太古和天河
    const parentId = parentMap[selectedNodeId];
    if (parentId && parentId !== 'taigu') {
      const parentNode = nodeMap[parentId];
      if (parentNode && parentNode.type !== 'tianhe') {
        const parentPos = positions[parentId];
        if (parentPos) {
          result.push({
            id: parentId,
            name: parentNode.name,
            pos: parentPos,
            type: parentNode.type,
            isParent: true,
          });
        }
      }
    }

    // 下一级（子节点），天河已有固定标签，跳过
    const children = childrenMap[selectedNodeId] || [];
    for (const childId of children) {
      const childPos = positions[childId];
      const childNode = nodeMap[childId];
      if (childPos && childNode && childNode.type !== 'tianhe') {
        result.push({
          id: childId,
          name: childNode.name,
          pos: childPos,
          type: childNode.type,
          isSelf: false,
        });
      }
    }
    return result;
  }, [selectedNodeId, relMap, positions]);

  useFrame((_, delta) => {
    const target = selectedNodeId ? 1 : 0;
    animRef.current += (target - animRef.current) * Math.min(1, delta * 4);
  });

  const progress = animRef.current;
  if (!selectedNodeId && progress < 0.005) return null;

  return (
    <group>
      {labels.map((label) => {
        const offset = LABEL_OFFSET[label.type] || 0.7;
        const labelNode = relMap.nodeMap[label.id];
        const color = labelNode?.color || '#888';
        const fontSize = FONT_SIZE[label.type] || 0.35;
        const baseOpacity = label.isSelf ? 0.9 : label.isParent ? 0.5 : 0.6;
        const outlineW = label.type === 'tianhe' ? 0.08 : 0.04;
        const renderOrder = RENDER_ORDER[label.type] || 1;
        return (
          <FlowingLabel key={label.id}
            name={label.name}
            position={[label.pos.x, label.pos.y + offset, label.pos.z]}
            color={color} fontSize={fontSize}
            baseOpacity={baseOpacity} progress={progress}
            outlineWidth={outlineW} renderOrder={renderOrder}
          />
        );
      })}
    </group>
  );
}
