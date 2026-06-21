import { Suspense } from 'react';
import DeepSpaceBackground from './DeepSpaceBackground';
import BackgroundStars from './BackgroundStars';
import CosmicDust from './CosmicDust';
import DistantNebulae from './DistantNebulae';

function Fallback() {
  return null;
}

/**
 * 宇宙背景系统 — 5 层背景构成深邃空间纵深感。
 * 每层独立 Suspense 包裹，单层异常不影响其他层和银河主体。
 */
export default function BackgroundSystem() {
  return (
    <group>
      <Suspense fallback={<Fallback />}>
        <DeepSpaceBackground />
      </Suspense>
      <Suspense fallback={<Fallback />}>
        <BackgroundStars />
      </Suspense>
      <Suspense fallback={<Fallback />}>
        <CosmicDust />
      </Suspense>
      <Suspense fallback={<Fallback />}>
        <DistantNebulae />
      </Suspense>
    </group>
  );
}
