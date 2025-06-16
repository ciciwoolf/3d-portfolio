
import * as THREE from "three";

export const HeroLights = () => (
    <>
        <spotLight
            position={[3, 3, 1]}
            angle={0.15}
            penumbra={0.25}
            intensity={40}
            color="white"
        />
        <spotLight
            position={[5, 5, 5]}
            angle={0.3}
            penumbra={0.5}
            intensity={40}
            color="#EBEBEB"
        />
        {/* purplish side fill */}
        <spotLight
            position={[-5, 1, 1]}
            angle={0.1}
            penumbra={0}
            intensity={60}
            color="#F4F7BE"
        />
        {/* area light for soft moody fill */}
        <primitive
            object={new THREE.RectAreaLight("#38AECC", 8, 3, 2)}
            position={[1, 3, 4]}
            rotation={[-Math.PI / 4, Math.PI / 4, 0]}
            intensity={15}
        />
        {/* subtle point light for atmospheric tone */}
        <pointLight position={[0, 1, 0]} intensity={10} color="#52489C" />
        <pointLight position={[1, 2, -2]} intensity={10} color="#0d00a4" />
    </>
);
