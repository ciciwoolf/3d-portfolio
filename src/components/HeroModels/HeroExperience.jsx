import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { useRef } from "react";
import { Room } from "./Room";
import { HeroLights } from "./HeroLights";
import Particles from "./Particles";
import { Suspense } from "react";

// Auto-rotating group component
const RotatingGroup = ({ children, isMobile }) => {
    const groupRef = useRef();
    
    useFrame((state, delta) => {
        if (groupRef.current) {
            // Slow, continuous rotation on the Y-axis
            groupRef.current.rotation.y += delta * 0.2; // Adjust speed here (0.2 = slow rotation)
        }
    });
    
    return (
        <group 
            ref={groupRef}
            scale={isMobile ? 0.7 : 1}
            position={[0, -3.5, 0]}
            rotation={[0, -Math.PI / 4, 0]}
        >
            {children}
        </group>
    );
};

export const HeroExperience = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

    return (
        <Canvas 
            camera={{ 
                position: [0, 0, 15], 
                fov: 45,
                near: 0.1,
                far: 1000
            }}
            style={{
                width: '100%',
                height: '100%',
                display: 'block',
                touchAction: 'none'
            }}
        >
            <ambientLight intensity={0.2} color="#1a1a40" />
            
            {/* Disable all user interaction with OrbitControls */}
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
                autoRotate={true}
                autoRotateSpeed={0.5}
                maxDistance={20}
                minDistance={10}
            />

            <Suspense fallback={null}>
                <HeroLights />
                <group position={[0, 0, -10]}>
                    <Particles count={isMobile ? 30 : 50} />
                </group>
                <RotatingGroup isMobile={isMobile}>
                    <Room />
                </RotatingGroup>
            </Suspense>
            )
        </Canvas>
    );
};