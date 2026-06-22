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
import Baodian from './components/Baodian';
import StarDetailPanel from './components/StarDetailPanel';


const M = {
  modeBtn: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '3px', padding: '3px 8px', cursor: 'pointer',
    color: '#666', fontSize: '11px', letterSpacing: '0.05em',
    fontFamily: '"Noto Serif SC","SimSun",serif', transition: 'all 0.3s',
  },
  subBtn: (active) => ({
    background: active ? 'rgba(120,160,200,0.15)' : 'rgba(255,255,255,0.04)',
    border: active ? '1px solid rgba(120,160,200,0.35)' : '1px solid rgba(255,255,255,0.1)',
    borderRadius: '3px', padding: '3px 8px', cursor: 'pointer',
    color: active ? '#a0c0e0' : '#555', fontSize: '11px',
    fontFamily: '"Noto Serif SC","SimSun",serif', transition: 'all 0.3s',
  }),
};

// ==================== 星图场景 ====================
function StarMapScene({ hoveredNode, setHoveredNode, selectedNodeId, setSelectedNodeId,
  isFocusMode, setIsFocusMode, focusedNodeId, setFocusedNodeId, positions, connectionNodeId,
  selectedNodeInfo, handleClick, handleMissed, dpr, worldPositions, onSwitchToBaodian }) {

  const detailNode = useMemo(() => {
    if (!connectionNodeId || !selectedNodeInfo) return null;
    const { nodeMap } = buildRelationshipMap(worldData);
    const node = nodeMap[connectionNodeId];
    if (!node) return null;
    return {
      id: connectionNodeId,
      name: node.name,
      type: node.type,
      color: node.color,
      baodianId: node.id,
    };
  }, [connectionNodeId, selectedNodeInfo, worldData]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#020308', position: 'relative', overflow: 'hidden' }}>

      {/* 悬停信息 */}
      {hoveredNode && (
        <div style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 15, background: 'rgba(6,13,26,0.9)', border: '1px solid rgba(120,160,200,0.3)',
          borderRadius: '6px', padding: '8px 20px', color: '#a0c0e0',
          fontFamily: '"Noto Serif SC","SimSun",serif', fontSize: '14px', backdropFilter: 'blur(6px)',
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
        color: '#999', fontSize: '11px', fontFamily: '"Noto Serif SC","SimSun",serif',
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

      {/* 右侧详情浮窗 */}
      <StarDetailPanel node={detailNode} onSwitchToBaodian={onSwitchToBaodian} />

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

        <BackgroundSystem />

        <group rotation={[Math.PI, 0, 0]}>
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

// ==================== 主组件 ====================
export default function App() {
  const [mode, setMode] = useState('star'); // 'star' | 'baodian'
  const [baodianEntryId, setBaodianEntryId] = useState(null);
  const [starFocusNodeId, setStarFocusNodeId] = useState(null);

  // 星图状态
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

  const handleSwitchToBaodian = useCallback((entryId) => {
    setBaodianEntryId(entryId || null);
    setMode('baodian');
  }, []);

  const handleViewInStarMap = useCallback((nodeId) => {
    if (nodeId) {
      setStarFocusNodeId(nodeId);
      setIsFocusMode(true);
      setFocusedNodeId(nodeId);
    }
    setMode('star');
  }, []);

  const dpr = Math.min(window.devicePixelRatio, 2);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#020308', position: 'relative', overflow: 'hidden' }}>

      {/* 左上角：模式切换 */}
      <div style={{
        position: 'absolute', top: '12px', left: '12px', zIndex: 30,
        display: 'flex', gap: '6px', alignItems: 'center',
      }}>
        {/* 模式切换 — 箭头 + 对方模式 */}
        {mode === 'baodian' && (
          <button onClick={() => { setMode('star'); setBaodianEntryId(null); }}
            style={M.modeBtn}>
            ← 星图
          </button>
        )}
        {mode === 'star' && (
          <button onClick={() => { setMode('baodian'); setBaodianEntryId(null); }}
            style={M.modeBtn}>
            → 修罗谱
          </button>
        )}
        {/* 子模式（仅星图） */}
        {mode === 'star' && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => { setIsFocusMode(true); setSelectedNodeId(null); }}
              style={M.subBtn(isFocusMode)}>
              聚焦
            </button>
            <button onClick={() => { setIsFocusMode(false); setFocusedNodeId(null); }}
              style={M.subBtn(!isFocusMode)}>
              探索
            </button>
          </div>
        )}
      </div>

      {/* 内容切换 */}
      {mode === 'star' ? (
        <StarMapScene
          hoveredNode={hoveredNode} setHoveredNode={setHoveredNode}
          selectedNodeId={selectedNodeId} setSelectedNodeId={setSelectedNodeId}
          isFocusMode={isFocusMode} setIsFocusMode={setIsFocusMode}
          focusedNodeId={focusedNodeId} setFocusedNodeId={setFocusedNodeId}
          positions={positions} connectionNodeId={connectionNodeId}
          selectedNodeInfo={selectedNodeInfo}
          handleClick={handleClick} handleMissed={handleMissed}
          dpr={dpr} worldPositions={worldPositions}
          onSwitchToBaodian={handleSwitchToBaodian}
        />
      ) : (
        <Baodian initialEntryId={baodianEntryId} onViewInStarMap={handleViewInStarMap} />
      )}
    </div>
  );
}
