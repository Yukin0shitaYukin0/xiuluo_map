import { useState, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { worldData } from './data/worldData';
import { computeLayout } from './data/layoutEngine';
import { buildRelationshipMap } from './data/relationshipUtils';
import TianheArm from './components/TianheArm';
import TaiguCore from './components/TaiguCore';
import ConnectionLines from './components/ConnectionLines';
import NodeLabels from './components/NodeLabels';
import SelectedNodeRunes from './components/SelectedNodeRunes';
import FocusController from './components/FocusController';
import GalaxyBackground from './components/GalaxyBackground';
import BackgroundSystem from './components/background/BackgroundSystem';


const modeBtnStyle = (active) => ({
  background: active ? 'rgba(120,160,200,0.2)' : 'rgba(255,255,255,0.05)',
  border: active ? '1px solid rgba(120,160,200,0.5)' : '1px solid rgba(255,255,255,0.15)',
  borderRadius: '4px', padding: '5px 12px', cursor: 'pointer',
  color: active ? '#a0c0e0' : '#666', fontSize: '12px',
  fontFamily: '"Noto Serif SC",serif', transition: 'all 0.3s',
});

// ==================== 主场景 ====================
export default function App() {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const positions = useMemo(() => computeLayout(worldData), []);

  const worldPositions = useMemo(() => {
    const result = {};
    for (const [id, pos] of Object.entries(positions)) {
      result[id] = { x: pos.x, y: -pos.y, z: -pos.z };
    }
    return result;
  }, [positions]);

  const connectionNodeId = isFocusMode ? focusedNodeId : selectedNodeId;

  const selectedNodeInfo = useMemo(() => {
    if (!connectionNodeId || !positions[connectionNodeId]) return null;
    const { nodeMap } = buildRelationshipMap(worldData);
    const node = nodeMap[connectionNodeId];
    if (!node) return null;
    return { position: positions[connectionNodeId], color: node.color, type: node.type };
  }, [connectionNodeId, positions, worldData]);

  const handleClick = useCallback((nodeData) => {
    if (!nodeData) return;
    if (isFocusMode) {
      setFocusedNodeId(nodeData.id);
      setSelectedNodeId(null);
    } else {
      setSelectedNodeId((prev) => prev === nodeData.id ? null : nodeData.id);
    }
  }, [isFocusMode]);

  const handleMissed = useCallback(() => {
    if (!isFocusMode) setSelectedNodeId(null);
  }, [isFocusMode]);

  const dpr = Math.min(window.devicePixelRatio, 2);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#020308', position: 'relative', overflow: 'hidden' }}>

      {/* 模式切换 */}
      <div style={{
        position: 'absolute', top: '16px', left: '16px', zIndex: 20,
        display: 'flex', gap: '4px',
      }}>
        <button onClick={() => { setIsFocusMode(true); setSelectedNodeId(null); }}
          style={modeBtnStyle(isFocusMode)}>
          聚焦模式
        </button>
        <button onClick={() => { setIsFocusMode(false); setFocusedNodeId(null); }}
          style={modeBtnStyle(!isFocusMode)}>
          探索模式
        </button>
      </div>

      {/* 悬停信息 */}
      {hoveredNode && (
        <div style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 15, background: 'rgba(6,13,26,0.9)', border: '1px solid rgba(120,160,200,0.3)',
          borderRadius: '6px', padding: '8px 20px', color: '#a0c0e0',
          fontFamily: '"Noto Serif SC",serif', fontSize: '14px', backdropFilter: 'blur(6px)',
        }}>
          {hoveredNode.name}
          <span style={{ marginLeft: '10px', fontSize: '11px', color: '#888', letterSpacing: '0.1em' }}>
            {hoveredNode.type === 'taigu'    ? '万象之源' :
             hoveredNode.type === 'tianhe'   ? `天河 · ${hoveredNode.region}` :
             hoveredNode.type === 'xingyu'   ? '星域' :
             hoveredNode.type === 'shangjie' ? '上界' :
             hoveredNode.type === 'fanjie'   ? '凡界' : '下界'}
          </span>
        </div>
      )}

      {/* 图例 */}
      <div style={{
        position: 'absolute', bottom: '16px', left: '16px', zIndex: 10,
        display: 'flex', gap: '14px',
        color: '#999', fontSize: '11px', fontFamily: '"Noto Serif SC",serif',
      }}>
        {[
          { color: '#c8c8d0', label: '星域' },
          { color: '#FFD85A', label: '上界' },
          { color: '#A45CFF', label: '凡界' },
          { color: '#34FF7A', label: '下界' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{
              display: 'inline-block', width: '8px', height: '8px',
              borderRadius: '50%', background: item.color,
            }} />
            {item.label}
          </div>
        ))}
      </div>

      {/* 操作提示 */}
      <div style={{
        position: 'absolute', bottom: '16px', right: '24px', zIndex: 10,
        color: '#555', fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.05em',
      }}>
        拖拽旋转 · 滚轮缩放 · 右键平移
      </div>

      {/* 3D 画布 */}
      <Canvas style={{ width: '100%', height: '100%' }}
        camera={{ position: [0, 18, 85], fov: 55, near: 0.5, far: 600000 }}
        dpr={[1, dpr]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onPointerMissed={handleMissed}>

        <color attach="background" args={['#020308']} />

        {/* Layer 1-5: 宇宙背景系统（group 外，不受银河旋转影响） */}
        <BackgroundSystem />

        <group rotation={[Math.PI, 0, 0]}>
          {/* Layer 6: 银河主体 */}
          <GalaxyBackground />

          <TaiguCore position={[0, 0, 0]} onClick={handleClick} />

          {worldData.tianhe.map((th) => (
            <TianheArm key={th.id} data={th}
              positions={positions} onHover={setHoveredNode} onClick={handleClick} />
          ))}

          <ConnectionLines selectedNodeId={connectionNodeId} positions={positions} worldData={worldData} />
          <NodeLabels selectedNodeId={isFocusMode ? focusedNodeId : selectedNodeId} positions={positions} worldData={worldData} />
          {connectionNodeId && selectedNodeInfo && selectedNodeInfo.type !== 'taigu' && selectedNodeInfo.type !== 'tianhe' && (
            <SelectedNodeRunes position={selectedNodeInfo.position} color={selectedNodeInfo.color} type={selectedNodeInfo.type} />
          )}
        </group>

        <FocusController focusedNodeId={focusedNodeId} positions={worldPositions} worldData={worldData} enabled={isFocusMode} />

        <EffectComposer>
          <Bloom luminanceThreshold={0.45} luminanceSmoothing={0.9} intensity={0.6} radius={0.5} />
          <Bloom luminanceThreshold={0.70} luminanceSmoothing={0.95} intensity={0.35} radius={1.0} />
        </EffectComposer>

        <OrbitControls makeDefault enableDamping dampingFactor={0.08} minDistance={2} maxDistance={120} />
      </Canvas>
    </div>
  );
}
