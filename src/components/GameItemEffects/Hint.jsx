import styled from "styled-components";
import hintEffect from "@/assets/effects/hint.gif";
import { useCallback, useMemo } from "react";
import { configStore } from "../../puzzle-core";

const { getConfig } = configStore;

// TODO: 다른 사람 화면에는 힌트 위치가 다른 이슈가 있음..
export default function Hint({ hintList, setHintList }) {
  const handleClickHint = useCallback(
    (id) => {
      setHintList((prev) => prev.filter((hint) => hint.id !== id));
    },
    [setHintList],
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
  position: absolute;
  left: ${({ x }) => `${x}px`};
  top: ${({ y }) => `${y}px`};
  width: 150px;
  cursor: pointer;
`;
