import { useMemo } from 'react';
import { Billboard, Text } from '@react-three/drei';
import StarNode from './StarNode';

export default function TianheArm({ data, positions, onHover, onClick }) {
  const thPos = positions[data.id];
  const tianhePos = thPos ? [thPos.x, thPos.y, thPos.z] : [0, 0, 0];

  const allChildren = useMemo(() => {
    const result = [];
    function collect(children) {
      if (!children) return;
      for (const child of children) {
        const pos = positions[child.id];
        if (pos) {
          result.push({
            ...child,
            worldPos: [pos.x, pos.y, pos.z],
            color: data.color,
          });
        }
        if (child.children) collect(child.children);
      }
    }
    collect(data.children);
    return result;
  }, [data, positions]);

  return (
    <group>
      {thPos && (
        <>
          <StarNode position={tianhePos} color={data.color} size={0.22} type="tianhe"
            name={data.name} onHover={onHover}
            nodeData={{ id: data.id, name: data.name, type: 'tianhe', region: data.region }}
            onClick={onClick} />
          <Billboard position={[thPos.x, thPos.y + 1.5, thPos.z]}>
            <Text fontSize={1.2} color={data.color}
              anchorX="center" anchorY="bottom"
              transparent depthTest={false}
              outlineWidth={0.08}
              outlineColor="rgba(0,0,0,0.35)"
              renderOrder={3}
            >
              {data.name}
            </Text>
          </Billboard>
        </>
      )}

      {allChildren.map((node) => (
        <StarNode key={node.id} position={node.worldPos} color={node.color || data.color}
          size={
            node.type === 'xingyu'   ? 0.14 :
            node.type === 'shangjie' ? 0.09 :
            node.type === 'fanjie'   ? 0.07 : 0.06
          }
          type={node.type} name={node.name} onHover={onHover}
          onClick={onClick}
          nodeData={{ id: node.id, name: node.name, type: node.type }} />
      ))}
    </group>
  );
}
