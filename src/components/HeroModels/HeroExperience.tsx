import React, { useRef, Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMediaQuery } from 'react-responsive';
import { Group } from 'three';
import { Room } from './Room';
import { HeroLights } from './HeroLights';
import Particles from './Particles';

// Auto-rotating group component
interface RotatingGroupProps {
  children: React.ReactNode;
  isMobile: boolean;
}

const RotatingGroup = ({
  children,
  isMobile,
}: RotatingGroupProps): React.JSX.Element => {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Slow, continuous rotation on the Y-axis
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group
      ref={groupRef}
      scale={isMobile ? 0.85 : 1}
      position={[0, -3.5, 0]}
      rotation={[0, -Math.PI / 4, 0]}
    >
      {children}
    </group>
  );
};

export const HeroExperience = (): React.JSX.Element => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  return (
    <Canvas
      camera={{
        position: [0, 0, 15],
        fov: 45,
        near: 0.1,
        far: 1000,
      }}
    >
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={!isMobile}
        autoRotate={true}
        autoRotateSpeed={0.5}
        maxDistance={20}
        minDistance={10}
      />

      <Suspense fallback={null}>
        <HeroLights />
        <group position={[0, 0, -10]}>
          <Particles count={isMobile ? 30 : 80} />
        </group>
        <RotatingGroup isMobile={isMobile}>
          <Room />
        </RotatingGroup>
      </Suspense>
    </Canvas>
  );
};
