import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function AbstractCore() {
  const groupRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.15;
      groupRef.current.rotation.x = time * 0.1;
      groupRef.current.position.y = Math.sin(time) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffccd2"
          roughness={0.2}
          metalness={0.95}
          wireframe={true}
          transparent
          opacity={0.42}
        />
      </mesh>

      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[2.2, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#f1f7ff"
          emissive="#c8ddff"
          emissiveIntensity={0.45}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[2.2, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#ffe8eb"
          emissive="#ffd3da"
          emissiveIntensity={0.45}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#cfdff7"
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

export default function EducationalModel() {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1.5}
          color="#ffffff"
        />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#dbe9ff" />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
        <AbstractCore />
      </Canvas>
    </div>
  );
}
