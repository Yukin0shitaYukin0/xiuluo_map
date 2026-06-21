import { useMemo } from 'react';
import { buildRelationshipMap, getAllConnectionLines, getRelatedLineSet } from '../data/relationshipUtils';
import { generateConnectionCurve } from './connection/CurveGenerator';
import CoreLine from './connection/CoreLine';

const AMBIENT_BRIGHTNESS = 0.15;
const SELECTED_BRIGHTNESS = 1.2;
const UNRELATED_BRIGHTNESS = 0.08;

export default function ConnectionLines({ selectedNodeId, positions, worldData }) {
  const allLines = useMemo(() =>
    getAllConnectionLines(worldData, positions),
  [worldData, positions]);

  const curves = useMemo(() => {
    const map = {};
    for (const line of allLines) {
      map[line.key] = generateConnectionCurve(line.fromPos, line.toPos);
    }
    return map;
  }, [allLines]);

  const relMap = useMemo(() =>
    buildRelationshipMap(worldData),
  [worldData]);

  const relatedSet = useMemo(() => {
    if (!selectedNodeId) return new Set();
    return getRelatedLineSet(selectedNodeId, relMap);
  }, [selectedNodeId, relMap]);

  if (allLines.length === 0) return null;

  return (
    <group>
      {allLines.map((line) => {
        const curve = curves[line.key];
        if (!curve) return null;

        const isRelated = relatedSet.has(line.key);
        const brightness = selectedNodeId
          ? (isRelated ? SELECTED_BRIGHTNESS : UNRELATED_BRIGHTNESS)
          : AMBIENT_BRIGHTNESS;

        return (
          <CoreLine
            key={line.key}
            curve={curve}
            color={line.color}
            brightness={brightness}
          />
        );
      })}
    </group>
  );
}
