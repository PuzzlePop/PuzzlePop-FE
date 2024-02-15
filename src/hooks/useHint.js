import { useCallback, useState } from "react";
import { getPuzzlePositionByIndex } from "../puzzle-core/utils";
import { configStore } from "../puzzle-core";
import { v4 as uuidv4 } from "uuid";

const { getConfig } = configStore;

export const useHint = () => {
  const [hintList, setHintList] = useState([]);

  const addHint = (puzzleIndexA, puzzleIndexB) => {
    try {
      const config = getConfig();
      config.groupTiles.forEach((tile) => {
        console.log(tile[0].position);
      });
      const [x1, y1] = getPuzzlePositionByIndex({ config: getConfig(), puzzleIndex: puzzleIndexA });
      const [x2, y2] = getPuzzlePositionByIndex({ config: getConfig(), puzzleIndex: puzzleIndexB });

      setHintList((prev) => [
        ...prev,
        makeHint({ x: x1, y: y1, puzzleIndex: puzzleIndexA }),
        makeHint({ x: x2, y: y2, puzzleIndex: puzzleIndexB }),
      ]);
    } catch (e) {
      console.log("퍼즐 위치가 없음");
    }
  };

  const cleanHint = useCallback(({ fromIndex, toIndex }) => {
    setHintList((prev) =>
      prev.filter((hint) => hint.puzzleIndex !== fromIndex && hint.puzzleIndex !== toIndex),
    );
  }, []);

  return {
    hintList,
    addHint,
    setHintList,
    cleanHint,
  };
};

const makeHint = ({ x, y, puzzleIndex }) => ({
  id: uuidv4(),
  x,
  y,
  puzzleIndex,
});
