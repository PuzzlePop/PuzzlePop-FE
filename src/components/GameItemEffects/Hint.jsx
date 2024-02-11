import styled from "styled-components";
import hintEffect from "@/assets/effects/hint.gif";
import { useCallback, useMemo } from "react";
import { configStore } from "../../puzzle-core";

const { getConfig } = configStore;

export default function Hint({ onClose, hintList }) {
  const handleClickHint = useCallback(
    (id) => {
      console.log(
        id,
        hintList.find((hint) => hint, id === id),
      );

      if (onClose) {
        onClose(id);
      }
    },
    [onClose, hintList],
  );

  const canvasCurrentRectX = useMemo(() => {
    const { x } = window.document.querySelector("canvas").getBoundingClientRect();
    return x;
  }, []);

  return (
    <>
      {hintList.map(({ id, x, y }) => (
        <HintImage
          key={id}
          src={hintEffect}
          x={canvasCurrentRectX + x - getConfig().tileWidth * 2}
          y={y - getConfig().tileWidth * 2}
          onClick={() => handleClickHint(id)}
        />
      ))}
    </>
  );
}

const HintImage = styled.img`
  z-index: 99;
  position: absolute;
  left: ${({ x }) => `${x}px`};
  top: ${({ y }) => `${y}px`};
  width: 150px;
  cursor: pointer;
`;
