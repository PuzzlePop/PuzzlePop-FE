import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import Paper from "paper";
import { initializeConfig } from "../puzzle-core/initializeConfig";
import { setMoveEvent } from "../puzzle-core/setMoveEvent";

const PuzzleConfigState = {
  config: null,
  initializePuzzle: () => {},
};

const PuzzleConfigContext = createContext(PuzzleConfigState);

export const usePuzzleConfig = () => useContext(PuzzleConfigContext);

export const PuzzleConfigProvider = ({ children }) => {
  const canvasRef = useRef(null);
  const [config, setConfig] = useState(null);

  const initializePuzzle = useCallback(
    ({ puzzleImg, level, shapes, board }) => {
      if (!canvasRef.current || config !== null) {
        return;
      }

      Paper.setup(canvasRef.current);

      const config1 = initializeConfig({ img: puzzleImg, level, board, shapes });
      const config2 = setMoveEvent({ config: config1 });
      setConfig(config2);
    },
    [config],
  );

  const contextValue = useMemo(
    () => ({ config, canvasRef, initializePuzzle }),
    [config, initializePuzzle],
  );

  return (
    <PuzzleConfigContext.Provider value={contextValue}>{children}</PuzzleConfigContext.Provider>
  );
};
