import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import Paper from "paper";
import { Point } from "paper/dist/paper-core";
import { initializeConfig } from "../puzzle-core/initializeConfig";
import { setMoveEvent } from "../puzzle-core/setMoveEvent";
import { uniteTiles } from "../puzzle-core/uniteTiles";
import { removeItemStyleToPiece, setItemStyleToAllPiece } from "../puzzle-core/item";

const PuzzleConfigState = {
  config: null,
  itemInventory: [],
  initializePuzzle: () => {},
  lockPuzzle: () => {},
  movePuzzle: () => {},
  unLockPuzzle: () => {},
  addPiece: () => {},
  addCombo: () => {},
};

const PuzzleConfigContext = createContext(PuzzleConfigState);

export const usePuzzleConfig = () => useContext(PuzzleConfigContext);

export const PuzzleConfigProvider = ({ children }) => {
  const canvasRef = useRef(null);
  const [itemInventory, setItemInventory] = useState([]);
  const [config, setConfig] = useState(null);

  const initializePuzzle = useCallback(
    ({ puzzleImg, level, shapes, board = [], itemList = [] }) => {
      if (!canvasRef.current || config !== null) {
        return;
      }
      // 단계별 config 설정
      Paper.setup(canvasRef.current);
      const initializedConfig = initializeConfig({ img: puzzleImg, level, board, shapes });
      const attachedMoveEventConfig = setMoveEvent({ config: initializedConfig });
      const attachedItemToAllPieceConfig = setItemStyleToAllPiece({
        config: attachedMoveEventConfig,
        itemList,
      });

      // 3. 상태 업데이트
      setConfig(() => ({ ...attachedItemToAllPieceConfig }));
    },
    [config],
  );

  const lockPuzzle = useCallback((x, y, index) => {
    console.log(x, y, index);
    // TODO: "Lock"이 걸려있다는 처리해야함
    // 피그마처럼 유저별로 "색깔"을 지정해두고 border 색깔을 변경하는 것도 좋을듯?
  }, []);

  const movePuzzle = useCallback((x, y, index) => {
    setConfig((prevConfig) => {
      const { tiles } = prevConfig;
      tiles[index].position = new Point(x, y);
      return { tiles, ...prevConfig };
    });
  }, []);

  const unLockPuzzle = useCallback((x, y, index) => {
    console.log(x, y, index);
    // TODO: 여기서 Lock에 대한 UI처리를 해제한다.
  }, []);

  const addPiece = useCallback(({ fromIndex, toIndex, itemList = [] }) => {
    setItemInventory(itemList);

    setConfig((prevConfig) => {
      const afterUnitedConfig = uniteTiles({
        config: prevConfig,
        preIndex: fromIndex,
        nowIndex: toIndex,
      });
      const afterCheckItemConfig = removeItemStyleToPiece({
        config: afterUnitedConfig,
        fromIndex,
        toIndex,
      });
      return { ...afterCheckItemConfig };
    });
  }, []);

  const addCombo = useCallback((fromIndex, toIndex, direction) => {
    let dir = -1;
    switch (direction) {
      case 0:
        dir = 3;
        break;
      case 1:
        dir = 0;
        break;
      case 2:
        dir = 2;
        break;
      case 3:
        dir = 1;
        break;
    }

    setConfig((prevConfig) => {
      console.log("addCombo 함수 실행 :", fromIndex, toIndex, direction, dir);
      console.log(prevConfig);

      const nextConfig = uniteTiles({
        config: prevConfig,
        nowIndex: fromIndex,
        preIndex: toIndex,
        isSender: false,
        isCombo: true,
        direction: dir,
      });
      return { ...nextConfig };
    });
  }, []);

  const useItem = useCallback(() => {
    // 아이템을 사용하면..
    // 아이템 효과를 부여하고
    // 인벤토리에서 제거
  }, []);

  const contextValue = useMemo(
    () => ({
      config,
      canvasRef,
      itemInventory,
      initializePuzzle,
      lockPuzzle,
      movePuzzle,
      unLockPuzzle,
      addPiece,
      addCombo,
    }),
    [
      config,
      itemInventory,
      initializePuzzle,
      lockPuzzle,
      movePuzzle,
      unLockPuzzle,
      addPiece,
      addCombo,
    ],
  );

  return (
    <PuzzleConfigContext.Provider value={contextValue}>{children}</PuzzleConfigContext.Provider>
  );
};
