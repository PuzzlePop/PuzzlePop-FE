import { useEffect, useRef } from "react";
import styled from "styled-components";
import { configStore } from "../puzzle-core";

const { initializePuzzle } = configStore;

export default function PuzzleCanvas({ puzzleImg, level, shapes, board }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      initializePuzzle({ canvasRef, puzzleImg, level, shapes, board });
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
