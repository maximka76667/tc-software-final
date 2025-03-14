import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import GridHelpers from "../components/GridHelpers";
import { GRID_SIZE } from "../lib/consts";

const Viewer = () => {
  // Leva control options
  const { positionY, rotationX, rotationY, rotationZ } = useControls({
    // Transport box position
    positionY: { value: GRID_SIZE / 2, min: 2, max: GRID_SIZE - 2, step: 0.1 },

    // Transport box rotation
    // for X, Y and Z axis has to be set between -Math.PI / 2 and Math.PI / 2
    // with default value 0 and -90 to 90 degrees range
    rotationX: { value: 0, min: -Math.PI / 2, max: Math.PI / 2, step: 0.05 },
    rotationY: { value: 0, min: -Math.PI / 2, max: Math.PI / 2, step: 0.05 },
    rotationZ: { value: 0, min: -Math.PI / 2, max: Math.PI / 2, step: 0.05 },
  });

  return (
    <div className="w-full h-[calc(100vh-64px)]">
      <Canvas
        className="h-full w-full"
        camera={{
          // Initial camera position
          position: [-GRID_SIZE + 2, GRID_SIZE / 2 + 2, GRID_SIZE - 2],
          fov: 75,
        }}
      >
        {/* Lights */}
        <ambientLight />
        <pointLight intensity={100} position={[5, GRID_SIZE - 2, 5]} />
        <pointLight intensity={100} position={[-5, 2, -5]} />

        {/* Transport Box */}
        {/* Outer mesh used to initially rotate transport by -90 degrees */}
        {/* Note: changing default value and range for rotationY doesn't interact correctly with X and Z axises */}
        <mesh rotation={[0, -Math.PI / 2, 0]}>
          <mesh
            position={[0, positionY, 0]}
            rotation={[rotationX, rotationY, rotationZ]}
          >
            <boxGeometry args={[6, 2, 2]} />
            <meshNormalMaterial />
          </mesh>
        </mesh>

        {/* Magnets */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[2, 2, 1]} />
          <meshStandardMaterial
            color="silver"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        <mesh position={[0, GRID_SIZE - 0.5, 0]}>
          <cylinderGeometry args={[2, 2, 1]} />
          <meshStandardMaterial
            color="silver"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* Components which allows rotation, zooming, movement and etc for camera */}
        <OrbitControls target={[0, GRID_SIZE / 2 - 2, 0]} />

        {/* Background grid helpers */}
        <GridHelpers gridSize={GRID_SIZE} />
      </Canvas>
    </div>
  );
};

export default Viewer;
