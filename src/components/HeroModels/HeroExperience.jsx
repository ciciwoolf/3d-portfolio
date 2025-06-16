import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {useMediaQuery} from "react-responsive";
import { Room } from "./Room.jsx";
import { HeroLights } from "./HeroLights.jsx";

export const HeroExperience = () => {
    const isTablet = useMediaQuery({ query: '(max-width: 1024px'});
    const isMobile = useMediaQuery({ query: '(max-width: 768px'});
    return (
        <Canvas camera={{position: [1, 1, 8], fov: 45}}>

            <OrbitControls
                enablePan={false}
                enableZoom={!isTablet}
                maxDistance={20}
                minDistance={5}
                minPolarAngle={Math.PI / 5}
                maxPolarAngle={Math.PI / 2}
            />
            <HeroLights/>

            <group
                scale={isMobile ? 0.4 : 1}
                position={[0, -1.5, 0]}
            >
            <Room />
            </group>
        </Canvas>
    )
}
