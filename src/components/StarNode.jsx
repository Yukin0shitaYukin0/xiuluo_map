import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getStarTexture } from '../data/starTexture';
import { getNodeColor, BLOOM_BOOST } from '../data/colorSystem';

// ---- 核心球体着色器 (世界空间，消除黑线) ----
const coreVert = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec3 vPosition;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vPosition = position;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coreFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uDistAtten;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec3 vPosition;

  float hash3(vec3 p) {
    float h = dot(p, vec3(127.1, 311.7, 74.7));
    return fract(sin(h) * 43758.5453);
  }

  void main() {
    vec3 n = normalize(vWorldNormal);
    vec3 v = normalize(cameraPosition - vWorldPos);
    float NdotV = abs(dot(n, v));

    // 核心硬朗不透明
    float core = smoothstep(0.15, 0.55, NdotV);
    // 边缘快速软衰减
    float edge = 1.0 - smoothstep(0.55, 0.92, NdotV) * 0.88;
    float alpha = core * 0.92 + edge * 0.08;

    // 微颗粒纹理 (极轻微)
    float grain = (hash3(vPosition * 60.0) - 0.5) * 0.04;
    grain += (hash3(vPosition * 120.0 + uTime * 0.03) - 0.5) * 0.02;
    alpha = clamp(alpha + grain, 0.0, 1.0);

    // 微弱亮度脉动
    float pulse = 1.0 + sin(uTime * 2.3 + vPosition.x * 3.7) * 0.04
                       + sin(uTime * 3.1 + vPosition.z * 4.1) * 0.03;

    float luma = (0.85 + uDistAtten * 0.15) * pulse;

    gl_FragColor = vec4(uColor * luma, alpha);
  }
`;

// ---- 光晕壳着色器 (Fresnel) ----
const glowVert = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uTime;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  void main() {
    vec3 n = normalize(vWorldNormal);
    vec3 v = normalize(cameraPosition - vWorldPos);
    float fresnel = 1.0 - abs(dot(n, v));
    fresnel = pow(fresnel, 3.2);
    // 光晕中心透明
    float pulse = 1.0 + sin(uTime * 2.5 + fresnel * 3.14) * 0.2;
    float alpha = fresnel * uOpacity * pulse;
    alpha = smoothstep(0.0, 1.0, alpha);
    gl_FragColor = vec4(uColor, alpha);
  }
`;

// ---- 环绕粒子数据 ----
function useSparkData(count, radius) {
  return useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = radius * (0.6 + Math.random() * 0.4);
      p[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, [count, radius]);
}

// ---- 光晕壳组件 ----
function GlowShell({ size, color, opacity, speed, amp, phase, visible }) {
  const ref = useRef();
  const u = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uOpacity: { value: opacity },
    uTime: { value: 0 },
  }), [color, opacity]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    const s = 1 + Math.sin(state.clock.elapsedTime * speed + phase) * amp;
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref} visible={visible}>
      <sphereGeometry args={[size, 64, 64]} />
      <shaderMaterial
        vertexShader={glowVert}
        fragmentShader={glowFrag}
        uniforms={u}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function StarNode({ position, color, size, type, name, onHover, onClick, nodeData }) {
  const groupRef = useRef();
  const coreRef = useRef();
  const sparkRef = useRef();
  const [hovered, setHovered] = useState(false);
  const progress = useRef(0);

  const glowColor = getNodeColor(type, color);
  const bloom = BLOOM_BOOST[type] || 0.5;
  const sparkData = useSparkData(60, size * 7);

  const brightColor = useMemo(() => {
    const c = new THREE.Color(glowColor);
    c.r = Math.min(1, c.r * bloom);
    c.g = Math.min(1, c.g * bloom);
    c.b = Math.min(1, c.b * bloom);
    return c;
  }, [glowColor, bloom]);

  const coreUniforms = useMemo(() => ({
    uColor: { value: brightColor },
    uTime: { value: 0 },
    uDistAtten: { value: 0 },
  }), [brightColor]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const target = hovered ? 1 : 0;
    progress.current += (target - progress.current) * 0.1;
    const p = progress.current;

    // 核心着色器更新
    if (coreRef.current) {
      coreRef.current.material.uniforms.uTime.value = t;
      // 相机距离传给着色器
      const d = state.camera.position.length();
      coreRef.current.material.uniforms.uDistAtten.value = Math.min(1, 1 / (1 + d * 0.015));
      // 悬停放大
      const scale = 1 + p * 0.8;
      coreRef.current.scale.setScalar(scale);
    }

    // 粒子环旋转
    if (sparkRef.current) {
      sparkRef.current.rotation.y += 0.006 * p;
      sparkRef.current.rotation.x += 0.0025 * p;
      sparkRef.current.material.opacity = 0.6 * p;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 核心球体：自定义 shader */}
      <mesh ref={coreRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover?.(nodeData); }}
        onPointerOut={() => { setHovered(false); onHover?.(null); }}
        onClick={(e) => { e.stopPropagation(); onClick?.(nodeData); }}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <shaderMaterial
          vertexShader={coreVert}
          fragmentShader={coreFrag}
          uniforms={coreUniforms}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* 三层光晕 (悬停) */}
      <GlowShell size={size * 3.0} color={glowColor} opacity={0.45}
        speed={3.5} amp={0.12} phase={0} visible={hovered} />
      <GlowShell size={size * 5.5} color={glowColor} opacity={0.25}
        speed={2.0} amp={0.18} phase={1.5} visible={hovered} />
      <GlowShell size={size * 8.5} color={glowColor} opacity={0.12}
        speed={1.2} amp={0.22} phase={3.0} visible={hovered} />

      {/* 环绕微粒 */}
      <points ref={sparkRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={60} array={sparkData} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={size * 0.22}
          map={getStarTexture()}
          color={glowColor}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
          opacity={0}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
