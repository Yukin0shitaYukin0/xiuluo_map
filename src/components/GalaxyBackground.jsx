import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getStarTexture } from '../data/starTexture';
import { TIANHE_COLORS } from '../data/colorSystem';

// ---- 银河悬臂常数（与 layoutEngine 螺线对齐） ----
const A = 5.0;
const B = 0.50;
const R_MIN = 0.5;
const R_MAX = 85;
const ARM_COUNT = 8;
const K = 32;
const EXP_MIN = Math.exp(-R_MIN / K);
const EXP_MAX = Math.exp(-R_MAX / K);
const CDF_DIFF = EXP_MIN - EXP_MAX;

function rng(s) { const n = Math.sin(s * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }
function gauss(seed) {
  const u1 = Math.max(rng(seed), 0.0001), u2 = rng(seed + 0.5);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function spiralTheta(r) { return Math.log(Math.max(0.01, r) / A) / B; }
function spiralPoint(r, armOffset) {
  const theta = spiralTheta(r);
  const angle = armOffset + theta;
  return { x: r * Math.cos(angle), z: r * Math.sin(angle), angle };
}
function spiralPerp(angle) {
  const ca = Math.cos(angle), sa = Math.sin(angle);
  let px = -B * sa - ca, pz = B * ca - sa;
  const len = Math.sqrt(px * px + pz * pz);
  return len < 1e-6 ? { x: 1, z: 0 } : { x: px / len, z: pz / len };
}
function armWidth(r) {
  const x = Math.max(0.001, Math.min(0.999, r / R_MAX));
  return 0.15 + 14 * Math.pow(x, 0.35) * Math.pow(1 - x, 0.42);
}
function armThick(r) {
  const x = Math.max(0.001, Math.min(0.999, r / R_MAX));
  return 0.10 + 4.5 * Math.pow(x, 0.32) * Math.pow(1 - x, 0.38);
}

const TRACE_COLORS = Object.values(TIANHE_COLORS);

// ---- 悬臂线 ----
function ArmTraces() {
  const lines = useMemo(() => {
    const result = [];
    const N = 200;
    for (let arm = 0; arm < ARM_COUNT; arm++) {
      const armOffset = (arm / ARM_COUNT) * Math.PI * 2;
      const pts = [];
      for (let i = 0; i <= N; i++) {
        const r = R_MIN + (i / N) * (R_MAX - R_MIN);
        const sp = spiralPoint(r, armOffset);
        pts.push(new THREE.Vector3(sp.x, 0, sp.z));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      result.push({ geom, color: TRACE_COLORS[arm] });
    }
    return result;
  }, []);
  return (
    <group renderOrder={5}>
      {lines.map((l, i) => (
        <line key={i} geometry={l.geom} renderOrder={5}>
          <lineBasicMaterial color={l.color} transparent opacity={0.15} depthTest={false} />
        </line>
      ))}
    </group>
  );
}

// ---- 悬臂粒子 ----
function GalaxyArms() {
  const refA = useRef(), refB = useRef();

  const layers = useMemo(() => {
    const perArmA = 40000, perArmB = 8000;
    const cntA = perArmA * ARM_COUNT, cntB = perArmB * ARM_COUNT;
    const pA = new Float32Array(cntA * 3), cA = new Float32Array(cntA * 3);
    const pB = new Float32Array(cntB * 3), cB = new Float32Array(cntB * 3);
    let iA = 0, iB = 0;

    for (let arm = 0; arm < ARM_COUNT; arm++) {
      const armOffset = (arm / ARM_COUNT) * Math.PI * 2;

      for (let i = 0; i < perArmA; i++) {
        const seed = arm * 1e5 + i * 2.718;
        const r = -K * Math.log(EXP_MIN - rng(seed) * CDF_DIFF);
        const sp = spiralPoint(r, armOffset);
        const perp = spiralPerp(sp.angle);
        const w = Math.max(0.01, armWidth(r) * 0.5);
        const off = gauss(seed + 10) * w;

        pA[iA * 3] = sp.x + perp.x * off;
        pA[iA * 3 + 1] = gauss(seed + 12) * Math.max(0.01, armThick(r) * 0.5);
        pA[iA * 3 + 2] = sp.z + perp.z * off;

        const col = new THREE.Color('#FFFFFF');
        const hsl = {};
        col.getHSL(hsl);
        const rFade = 1 - Math.pow(r / R_MAX, 0.6) * 0.10;
        col.setHSL(hsl.h, hsl.s * 0.4, Math.min(0.98, hsl.l * (0.75 + rng(seed + 23) * 0.22) * rFade));
        cA[iA * 3] = col.r;
        cA[iA * 3 + 1] = col.g;
        cA[iA * 3 + 2] = col.b;
        iA++;
      }

      for (let i = 0; i < perArmB; i++) {
        const seed = arm * 1e5 + 200000 + i * 2.718;
        const r = -K * Math.log(EXP_MIN - rng(seed) * CDF_DIFF);
        const sp = spiralPoint(r, armOffset);
        const perp = spiralPerp(sp.angle);
        const w = Math.max(0.01, armWidth(r));
        const off = gauss(seed + 10) * w;

        pB[iB * 3] = sp.x + perp.x * off;
        pB[iB * 3 + 1] = gauss(seed + 12) * Math.max(0.01, armThick(r));
        pB[iB * 3 + 2] = sp.z + perp.z * off;

        const distRel = Math.abs(off) / w;
        const dim = Math.exp(-distRel * distRel * 1.5);
        const col = new THREE.Color('#FFFFFF');
        const hsl = {};
        col.getHSL(hsl);
        const rFade = 1 - Math.pow(r / R_MAX, 0.7) * 0.10;
        col.setHSL(hsl.h, hsl.s * 0.35, Math.min(0.98, hsl.l * (0.45 + dim * 0.52) * rFade));
        cB[iB * 3] = col.r;
        cB[iB * 3 + 1] = col.g;
        cB[iB * 3 + 2] = col.b;
        iB++;
      }
    }

    return [
      { p: pA, c: cA, n: cntA, s: 0.045, o: 0.95 },
      { p: pB, c: cB, n: cntB, s: 0.080, o: 0.55 },
    ];
  }, []);

  useFrame(() => {
    if (refA.current) refA.current.rotation.y += 0.00005;
    if (refB.current) refB.current.rotation.y += 0.00008;
  });

  return (
    <>
      {layers.map((d, i) => (
        <points key={i} ref={i === 0 ? refA : refB} renderOrder={5}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={d.n} array={d.p} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={d.n} array={d.c} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={d.s} map={getStarTexture()} vertexColors opacity={d.o}
            blending={THREE.AdditiveBlending} depthWrite={false} transparent sizeAttenuation />
        </points>
      ))}
    </>
  );
}

// ---- 银核（银河中心凸起） ----
function GalaxyCore() {
  const ref = useRef();
  const count = 20000;
  const { positions, colors } = useMemo(() => {
    const p = new Float32Array(count * 3), c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const seed = i * 1.414;
      const t = Math.pow(rng(seed), 1.3);
      const r = t * (A * 1.2);
      const theta = rng(seed + 1) * Math.PI * 2;
      const phi = Math.acos(2 * rng(seed + 2) - 1);
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.18;
      p[i * 3 + 2] = r * Math.cos(phi);
      const d = Math.sqrt(p[i * 3] ** 2 + p[i * 3 + 1] ** 2 + p[i * 3 + 2] ** 2);
      const col = new THREE.Color();
      const edge = 1 - Math.min(1, Math.max(0, (d - A * 0.7) / (A * 0.5)));
      col.setHSL(0.11 + (rng(seed + 5) - 0.5) * 0.06,
        0.08 + edge * 0.40,
        0.20 + edge * 0.55 + rng(seed + 6) * 0.10);
      c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b;
    }
    return { positions: p, colors: c };
  }, []);
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.00010; });
  return (
    <points ref={ref} renderOrder={5}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} map={getStarTexture()} vertexColors opacity={0.80}
        blending={THREE.AdditiveBlending} depthWrite={false} transparent />
    </points>
  );
}

// ---- Layer 6: 银河主体 ----
export default function GalaxyBackground() {
  return (
    <group>
      <GalaxyCore />
      <GalaxyArms />
      <ArmTraces />
    </group>
  );
}
