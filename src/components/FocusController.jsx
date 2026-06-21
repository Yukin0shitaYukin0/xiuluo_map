import { useRef, useLayoutEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { buildRelationshipMap } from '../data/relationshipUtils';

const CLOSE_DIST = { taigu: 14, tianhe: 12, xingyu: 10, shangjie: 7, fanjie: 6, xiajie: 5 };
const LERP_SPEED = 0.6;

export default function FocusController({ focusedNodeId, positions, worldData, enabled }) {
  const { camera, controls } = useThree();
  const targetNode = useRef(new THREE.Vector3());
  const startPos = useRef(new THREE.Vector3());
  const startQuat = useRef(new THREE.Quaternion());
  const endPos = useRef(new THREE.Vector3());
  const endQuat = useRef(new THREE.Quaternion());
  const animating = useRef(false);
  const progress = useRef(0);

  useLayoutEffect(() => {
    if (!enabled || !focusedNodeId || !positions || !worldData) {
      animating.current = false;
      if (controls) controls.enabled = true;
      return;
    }

    const nodePos = positions[focusedNodeId];
    if (!nodePos) return;

    const relMap = buildRelationshipMap(worldData);
    const nodeType = relMap.nodeMap[focusedNodeId]?.type;
    const closeDist = CLOSE_DIST[nodeType] || 8;
    const nodeP = new THREE.Vector3(nodePos.x, nodePos.y, nodePos.z);
    targetNode.current.copy(nodeP);

    // 方向：从节点指向相机当前位置
    const dir = new THREE.Vector3().copy(camera.position).sub(nodeP).normalize();
    if (dir.length() < 0.01) dir.set(0, 1, 0);

    // 目标位置：沿该方向后退 closeDist
    const end = nodeP.clone().addScaledVector(dir, closeDist);
    endPos.current.copy(end);

    // 预计算终点朝向（用 lookAt 方式，和 OrbitControls 一致）
    const endQuatTemp = new THREE.Quaternion();
    const tempCam = camera.clone();
    tempCam.position.copy(end);
    tempCam.lookAt(nodeP);
    endQuat.current.copy(tempCam.quaternion);

    // 保存起点
    startPos.current.copy(camera.position);
    startQuat.current.copy(camera.quaternion);
    progress.current = 0;
    animating.current = true;

    // 禁用 OrbitControls
    if (controls) {
      controls.enabled = false;
      controls.target.copy(nodeP);
    }
  }, [focusedNodeId, enabled, positions, worldData, camera, controls]);

  // 组件卸载时恢复
  useLayoutEffect(() => {
    return () => {
      if (controls) controls.enabled = true;
    };
  }, []);

  // 动画 + 守护
  useFrame((_, delta) => {
    if (!enabled || !controls) return;

    if (animating.current) {
      // 平滑动画
      progress.current += delta * LERP_SPEED;
      const t = Math.min(1, progress.current);
      // ease-in-out
      const et = t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;

      // 位置和朝向各自平滑过渡
      camera.position.lerpVectors(startPos.current, endPos.current, et);
      camera.quaternion.slerpQuaternions(startQuat.current, endQuat.current, et);
      controls.target.copy(targetNode.current);

      if (t >= 1) {
        animating.current = false;
        camera.position.copy(endPos.current);
        // 最终用 lookAt 对齐，确保和 OrbitControls 内部朝向一致
        camera.lookAt(targetNode.current);
        if (controls) {
          controls.target.copy(targetNode.current);
          controls.enabled = true;
        }
      }
    }
  }, 1);

  return null;
}
