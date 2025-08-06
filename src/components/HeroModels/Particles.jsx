import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

const Particles = ({ count = 200, maxCount = 200 }) => {
  const mesh = useRef();

  // Always use maxCount for buffer size, but only animate 'count' particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < maxCount; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 10,
          Math.random() * 10 + 5, // higher starting point
          (Math.random() - 0.5) * 10,
        ],
        speed: 0.005 + Math.random() * 0.001,
        active: i < count, // Only first 'count' particles are active
      });
    }
    return temp;
  }, [maxCount, count]);

  useFrame(() => {
    const positions = mesh.current.geometry.attributes.position.array;
    for (let i = 0; i < maxCount; i++) {
      if (i < count) {
        // Only animate active particles
        let y = positions[i * 3 + 1];
        y -= particles[i].speed;
        if (y < -2) y = Math.random() * 10 + 5;
        positions[i * 3 + 1] = y;
      } else {
        // Hide inactive particles by moving them far away
        positions[i * 3] = 1000;
        positions[i * 3 + 1] = 1000;
        positions[i * 3 + 2] = 1000;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  // Always create buffer with maxCount size
  const positions = new Float32Array(maxCount * 3);
  particles.forEach((p, i) => {
    if (i < count) {
      positions[i * 3] = p.position[0];
      positions[i * 3 + 1] = p.position[1];
      positions[i * 3 + 2] = p.position[2];
    } else {
      // Hide inactive particles
      positions[i * 3] = 1000;
      positions[i * 3 + 1] = 1000;
      positions[i * 3 + 2] = 1000;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={maxCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.05}
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
};

export default Particles;
