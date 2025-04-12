import { useRef } from "react";
import { GridHelper } from "three";

interface GridHelperComponentProps {
  position: [number, number, number];
  rotation: [number, number, number];
  gridSize?: number;
}

function GridHelperComponent({
  position,
  rotation,
  gridSize = 10,
}: GridHelperComponentProps) {
  const gridRef = useRef<GridHelper>(null!);

  return (
    <primitive
      object={new GridHelper(gridSize, gridSize, "#444", "#999")}
      ref={gridRef}
      position={position}
      rotation={rotation}
    />
  );
}

export default GridHelperComponent;
