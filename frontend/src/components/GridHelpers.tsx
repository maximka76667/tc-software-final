import GridHelperComponent from "./GridHelperComponent";

interface GridHelpersProps {
  gridSize?: number;
}

const GridHelpers = ({ gridSize = 10 }: GridHelpersProps) => {
  const gridOffset = gridSize / 2;

  return (
    <>
      <GridHelperComponent
        position={[0, gridOffset, -gridOffset]}
        rotation={[Math.PI / 2, 0, 0]}
        gridSize={gridSize}
      />

      <GridHelperComponent
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        gridSize={gridSize}
      />

      <GridHelperComponent
        position={[gridOffset, gridOffset, 0]}
        rotation={[0, 0, Math.PI / 2]}
        gridSize={gridSize}
      />
    </>
  );
};

export default GridHelpers;
