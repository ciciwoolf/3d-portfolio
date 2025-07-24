
import * as THREE from "three";
import { colors } from "../../theme/colors";

export const HeroLights = () => {
    const { lights } = colors;
    
    return (
        <>
            {/* Main key light */}
            <spotLight
                position={[3, 3, 1]}
                angle={0.15}
                penumbra={0.5}
                intensity={30}
                color={lights.mainSpotlight}
            />
            
            {/* Fill light */}
            <spotLight
                position={[4, 4, 5]}
                angle={0.3}
                penumbra={0.5}
                intensity={40}
                color={lights.fillLight}
            />
            
            {/* Side fill light */}
            <spotLight
                position={[-5, 1, 1]}
                angle={0.1}
                penumbra={0.8}
                decay={2}
                distance={20}
                color={lights.sideFill}
            />
            
            {/* Area light for soft moody fill */}
            <primitive
                object={new THREE.RectAreaLight(
                    lights.areaLight,
                    8, // intensity
                    3, // width
                    2  // height
                )}
                position={[1, 3, 4]}
                rotation={[-Math.PI / 4, Math.PI / 4, 0]}
                intensity={15}
            />
            
            {/* Atmospheric point lights */}
            <pointLight
                position={[0, 1, 0]}
                intensity={50}
                color={lights.pointLight1}
            />
            <pointLight
                position={[1, 2, -2]}
                intensity={30}
                color={lights.pointLight2}
            />
        </>
    );
};
