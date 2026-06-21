import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getStarTexture } from '../data/starTexture';
import { TIANHE_COLORS } from '../data/colorSystem';
import { NOISE_GLSL } from '../shaders/noise';

// ==================== Layer 1: 神域圣核 ====================
function SacredCore({ onClick }) {
  const meshRef = useRef();
  const { vs, fs, uniforms } = useMemo(() => {
    const u = { uTime: { value: 0 } };
    return {
      uniforms: u,
      vs: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vViewPos;
        varying vec3 vWorldNormal;
        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vViewPos = -mvPos.xyz;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fs: NOISE_GLSL + /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vViewPos;
        varying vec3 vWorldNormal;
        uniform float uTime;

        void main() {
          // 多层次 FBM 噪声
          vec3 p = vWorldNormal * 5.5 + uTime * 0.10;
          float n1 = fbm(p);
          float n2 = fbm(vWorldNormal * 9.0 - uTime * 0.06);
          float n = n1 * 0.65 + n2 * 0.35;

          // 色阶：核白 → 暖金 → 琥珀
          vec3 coreC  = vec3(1.0,   0.996, 0.965);  // #FFFDF6
          vec3 midC   = vec3(1.0,   0.914, 0.722);  // #FFE9B8
          vec3 deepC  = vec3(1.0,   0.824, 0.416);  // #FFD26A

          float t = n * 0.60 + 0.40;
          vec3 col = mix(deepC, midC,  smoothstep(0.40, 0.58, t));
          col = mix(col,   coreC, smoothstep(0.58, 0.80, t));

          // 最亮核斑
          float hotSpot = smoothstep(0.80, 0.92, t);
          col = mix(col, vec3(1.0, 0.98, 0.94), hotSpot * 0.35);

          // 菲涅尔边缘辉光
          vec3 vd = normalize(vViewPos);
          float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vd)), 3.5);
          col += vec3(1.0, 0.85, 0.50) * fresnel * 0.45;

          // 呼吸脉动
          float pulse = 1.0 + sin(uTime * 1.4) * 0.06 + sin(uTime * 2.3 + 1.7) * 0.04;
          col *= pulse;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    };
  }, []);

  useFrame((s) => { uniforms.uTime.value = s.clock.elapsedTime; });

  return (
    <mesh ref={meshRef}
      onClick={(e) => { e.stopPropagation(); onClick?.({ id: 'taigu', name: '太古神域', type: 'taigu' }); }}>
      <sphereGeometry args={[1.05, 72, 72]} />
      <shaderMaterial
        vertexShader={vs}
        fragmentShader={fs}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

// ==================== Layer 2: 混沌能量层 ====================
function ChaosEnergy() {
  const groups = useMemo(() => {
    const result = [];
    const configs = [
      { count: 2200, rMin: 1.15, rMax: 1.75, hue: 0.13, sat: 0.5, light: 0.55, speed: 0.6, opacity: 0.55 },
      { count: 1800, rMin: 1.30, rMax: 2.10, hue: 0.12, sat: 0.3, light: 0.70, speed: 0.4, opacity: 0.40 },
      { count: 1600, rMin: 1.45, rMax: 2.30, hue: 0.16, sat: 0.4, light: 0.50, speed: 0.7, opacity: 0.35 },
      { count: 1200, rMin: 1.55, rMax: 2.60, hue: 0.75, sat: 0.15, light: 0.65, speed: 0.5, opacity: 0.25 },
    ];
    for (const cfg of configs) {
      const p = new Float32Array(cfg.count * 3);
      const c = new Float32Array(cfg.count * 3);
      for (let i = 0; i < cfg.count; i++) {
        const r = cfg.rMin + Math.random() * (cfg.rMax - cfg.rMin);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        p[i * 3 + 2] = r * Math.cos(phi);
        const col = new THREE.Color();
        col.setHSL(cfg.hue + Math.random() * 0.03, cfg.sat, cfg.light * (0.7 + Math.random() * 0.3));
        c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b;
      }
      result.push({ ...cfg, positions: p, colors: c, ref: null });
    }
    return result;
  }, []);

  const refs = useRef(groups.map(() => null));

  useFrame((state) => {
    groups.forEach((_, idx) => {
      const r = refs.current[idx];
      if (r) {
        r.rotation.y += 0.0003 * (groups[idx].speed || 0.5);
        r.rotation.x += 0.00015 * (groups[idx].speed || 0.5);
        r.rotation.z += 0.0001 * (groups[idx].speed || 0.5);
      }
    });
  });

  return groups.map((g, i) => (
    <points key={i} ref={(el) => { refs.current[i] = el; }}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={g.count} array={g.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={g.count} array={g.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04} map={getStarTexture()} vertexColors
        blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={g.opacity}
      />
    </points>
  ));
}

// ==================== Layer 3: 大道法阵层 ====================
function DaoArray() {
  const rings = useMemo(() => [
    { radius: 1.65, tube: 0.035, rotAxis: [0, 1, 0], speed: 1.0, color: '#FFD36B' },
    { radius: 1.95, tube: 0.028, rotAxis: [1, 0.3, 0], speed: 0.7, color: '#FFE9B8' },
    { radius: 2.25, tube: 0.022, rotAxis: [0.3, 0, 1], speed: 0.5, color: '#FFC04D' },
  ], []);

  const ringData = useMemo(() => rings.map((ring) => {
    const { vs, fs, uniforms } = (() => {
      const u = { uTime: { value: 0 }, uColor: { value: new THREE.Color(ring.color) } };
      return {
        uniforms: u,
        vs: /* glsl */ `
          varying vec2 vUv;
          varying vec3 vWorldPos;
          void main() {
            vUv = uv;
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorldPos = wp.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fs: NOISE_GLSL + /* glsl */ `
          varying vec2 vUv;
          varying vec3 vWorldPos;
          uniform float uTime;
          uniform vec3 uColor;

          void main() {
            // 沿环符文段
            float seg36 = fract(vUv.x * 36.0);

            // 长符
            float longMark = smoothstep(0.0, 0.06, seg36) * smoothstep(0.22, 0.16, seg36);
            // 短符（点）
            float shortMark = smoothstep(0.42, 0.46, seg36) * smoothstep(0.54, 0.50, seg36);
            // 双点符
            float twinA = smoothstep(0.60, 0.625, seg36) * smoothstep(0.68, 0.665, seg36);
            float twinB = smoothstep(0.70, 0.725, seg36) * smoothstep(0.78, 0.765, seg36);

            float rune = max(max(longMark, shortMark * 0.55), max(twinA * 0.5, twinB * 0.5));

            // 管截面边缘辉光
            float edge = 1.0 - abs(vUv.y - 0.5) * 2.0;
            edge = pow(edge, 2.0);

            float alpha = rune * 0.85 + edge * 0.08;

            vec3 col = uColor * (0.15 + rune * 0.85 + edge * 0.12);
            // 符文亮斑
            col += uColor * rune * 0.4;

            gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
          }
        `,
      };
    })();
    return { ...ring, shaderVs: vs, shaderFs: fs, shaderUniforms: uniforms };
  }), [rings]);

  const groupRefs = useRef([]);

  useFrame((state) => {
    ringData.forEach((ring, idx) => {
      const g = groupRefs.current[idx];
      if (!g) return;
      const [ax, ay, az] = ring.rotAxis;
      const sp = ring.speed * 0.25;
      g.rotation.x += sp * ax * 0.01;
      g.rotation.y += sp * ay * 0.01;
      g.rotation.z += sp * az * 0.01;
      ring.shaderUniforms.uTime.value = state.clock.elapsedTime;
    });
  });

  return ringData.map((ring, i) => (
    <group key={i} ref={(el) => { groupRefs.current[i] = el; }}>
      <mesh>
        <torusGeometry args={[ring.radius, ring.tube, 32, 180]} />
        <shaderMaterial
          vertexShader={ring.shaderVs}
          fragmentShader={ring.shaderFs}
          uniforms={ring.shaderUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  ));
}

// ==================== Layer 4: 九天河起源环 ====================
function OriginRing() {
  const tianheEntries = Object.entries(TIANHE_COLORS);
  const count = tianheEntries.length; // 8
  const ringRadius = 3.3;
  const ANGLE_PER = (Math.PI * 2) / count;

  const nodes = useMemo(() => {
    return tianheEntries.map(([name, color], i) => {
      // 与 layoutEngine 角度公式一致：ti * ANGLE_PER_TIANHE - 1.35
      const angle = i * ANGLE_PER - 1.35;
      const x = Math.cos(angle) * ringRadius;
      const z = Math.sin(angle) * ringRadius;
      return { name, color, position: [x, 0, z], angle };
    });
  }, [ringRadius, count, ANGLE_PER, tianheEntries]);

  const glowRefs = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    nodes.forEach((_, i) => {
      const ref = glowRefs.current[i];
      if (ref) {
        const s = 1 + Math.sin(t * 2.0 + i * 0.8) * 0.2;
        ref.scale.setScalar(s);
      }
    });
  });

  return nodes.map((node, i) => (
    <group key={node.name}>
      {/* 主节点球 */}
      <mesh position={node.position}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={node.color} transparent opacity={0.9} />
      </mesh>
      {/* 脉冲光晕 */}
      <mesh ref={(el) => { glowRefs.current[i] = el; }} position={node.position}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial color={node.color} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  ));
}

// ==================== Layer 5: 神域星海 ====================
function StarOcean() {
  const ref = useRef();
  const count = 24000;

  const { positions, colors } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // 幂分布：大量粒子聚在核心附近
      const t = Math.random();
      const r = 0.3 + Math.pow(t, 0.55) * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);

      // 暖金色调，越近越亮
      const distNorm = r / 5.5;
      const hue = 0.115 + distNorm * 0.04;
      const sat = 0.2 + (1 - distNorm) * 0.4;
      const light = 0.25 + (1 - distNorm) * 0.55;
      const col = new THREE.Color();
      col.setHSL(hue, sat, Math.min(0.9, light));
      c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b;
    }
    return { positions: p, colors: c };
  }, []);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.00025;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04} map={getStarTexture()} vertexColors
        blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.80}
        sizeAttenuation
      />
    </points>
  );
}

// ==================== 主组件 ====================
export default function TaiguCore({ position, onClick }) {
  return (
    <group position={position}>
      {/* Layer 5: 神域星海（最外层，先渲染） */}
      <StarOcean />

      {/* Layer 4: 九天河起源环 */}
      <OriginRing />

      {/* Layer 3: 大道法阵层 */}
      <DaoArray />

      {/* Layer 2: 混沌能量层 */}
      <ChaosEnergy />

      {/* Layer 1: 神域圣核（最内层，可点击） */}
      <SacredCore onClick={onClick} />
    </group>
  );
}
