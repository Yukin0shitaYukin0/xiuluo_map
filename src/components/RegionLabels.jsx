import { Billboard, Text } from '@react-three/drei';

const REGIONS = [
  { name: '东域', angle: 0,          color: '#FFD36B' },
  { name: '北域', angle: Math.PI / 2, color: '#27D7FF' },
  { name: '西域', angle: Math.PI,     color: '#4B7FFF' },
  { name: '南域', angle: -Math.PI / 2,color: '#FF66C4' },
];

export default function RegionLabels() {
  const r = 38;
  return (
    <group>
      {REGIONS.map(({ name, angle, color }) => (
        <Billboard key={name}
          position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}
          follow={true} lockX={false} lockY={false} lockZ={false}>
          <Text
            fontSize={1.2}
            color={color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.08}
            outlineColor="rgba(0,0,0,0.35)"
            transparent
            depthTest={false}
            renderOrder={2}
          >
            {name}
          </Text>
        </Billboard>
      ))}
    </group>
  );
}
