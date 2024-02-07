import { useEffect } from "react";
import styled from "styled-components";
import { usePuzzleConfig } from "../hooks/usePuzzleConfig";

export default function PuzzleCanvas({ puzzleImg, level, shapes, board, picture }) {
  const { canvasRef, initializePuzzle } = usePuzzleConfig();

  useEffect(() => {
    if (canvasRef.current) {
      initializePuzzle({ puzzleImg, level, shapes, board, picture });
    }

    // eslint-disable-next-line
  }, [canvasRef]);

  return (
    <>
      <div style={{ width: "100vw", display: "flex", justifyContent: "center" }}>
        <div id="canvasContainer" style={{ position: "relative" }}>
          <Canvas ref={canvasRef} id="canvas" />
        </div>
      </div>
    </>
  );
}

const Canvas = styled.canvas`
  width: 2580px;
  height: 1440px;
  border: 1px solid #ccc;
`;
