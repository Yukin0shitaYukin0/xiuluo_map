import * as THREE from 'three';

export function spiralWind(r) {
  return Math.max(0, r - 5) / 48 * 2.0;
}

/**
 * 生成两个节点之间的自然弧线。
 * - 距离越远，弯曲越明显
 * - 近距离也保留微小弯曲（绝对禁止直线）
 * - 弯曲方向配合悬臂螺旋感（切线+径向混合）
 */
export function generateConnectionCurve(fromPos, toPos) {
  const from = new THREE.Vector3(fromPos.x, fromPos.y, fromPos.z);
  const to = new THREE.Vector3(toPos.x, toPos.y, toPos.z);
  const dist = from.distanceTo(to);
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);

  const distA = Math.sqrt(from.x * from.x + from.z * from.z);

  // 从原点（太古）出发：对数螺线
  if (distA < 0.01) {
    const rEnd = Math.sqrt(to.x * to.x + to.z * to.z);
    const angleEnd = Math.atan2(to.z, to.x);
    const spiralEnd = spiralWind(rEnd);
    const baseAngle = angleEnd - spiralEnd;
    const segs = 64;
    const pts = [];
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const r = t * rEnd;
      const a = baseAngle + spiralWind(r);
      const yOff = r > 5 ? Math.sin((r - 5) / 48 * Math.PI * 0.8) * 1.5 : 0;
      const y = from.y + (to.y - from.y) * t + yOff;
      pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    return new THREE.CatmullRomCurve3(pts);
  }

  // 常规节点间：二次贝塞尔（单个控制点，无锐角）
  const bendFactor = 0.08 + Math.min(dist / 80, 0.27);
  const bendMag = dist * bendFactor;

  const dir = new THREE.Vector3().subVectors(to, from).normalize();
  // 切线方向（逆时针，与悬臂螺旋一致）
  const tangentDir = new THREE.Vector3(-dir.z, 0, dir.x).normalize();
  // 离心方向
  const midR = Math.sqrt(mid.x * mid.x + mid.z * mid.z) || 0.01;
  const radialDir = new THREE.Vector3(mid.x / midR, 0, mid.z / midR).normalize();
  // 混合切线70% + 径向30%
  const bendDir = new THREE.Vector3()
    .addScaledVector(tangentDir, 0.7)
    .addScaledVector(radialDir, 0.3)
    .normalize();

  const verticalArc = dist * 0.06;
  const cp = new THREE.Vector3()
    .addVectors(mid, bendDir.clone().multiplyScalar(bendMag))
    .add(new THREE.Vector3(0, verticalArc, 0));

  return new THREE.QuadraticBezierCurve3(from.clone(), cp, to.clone());
}
