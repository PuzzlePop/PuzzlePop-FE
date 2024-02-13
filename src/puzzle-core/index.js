import Paper from "paper";
import { Point } from "paper/dist/paper-core";
import { initializeConfig } from "./initializeConfig";
import { removeItemStyleToPiece, searchItemList, setItemStyleToAllPiece } from "./item";
import { setMoveEvent } from "./setMoveEvent";
import { uniteTiles } from "./uniteTiles";

const createPuzzleConfig = () => {
  let config = {};

  const initializePuzzle = ({ canvasRef, puzzleImg, level, shapes, board = [], picture }) => {
    // 단계별 config 설정
    Paper.setup(canvasRef.current);
    const initializedConfig = initializeConfig({ img: puzzleImg, level, board, shapes, picture });
    const attachedMoveEventConfig = setMoveEvent({ config: initializedConfig });
    const attachedItemToAllPieceConfig = setItemStyleToAllPiece({
      config: attachedMoveEventConfig,
      itemList: searchItemList(board),
    });

    config = attachedItemToAllPieceConfig;
  };

  const initializePuzzle2 = (config2, itemList = []) => {
    const attachedItemToAllPieceConfig = setItemStyleToAllPiece({
      config: config2,
      itemList,
    });

    config = attachedItemToAllPieceConfig;
  };

  const getConfig = () => ({ ...config });

  const lockPuzzle = (x, y, index) => {
    console.log(x, y, index);
    // TODO: "Lock"이 걸려있다는 처리해야함
    // 피그마처럼 유저별로 "색깔"을 지정해두고 border 색깔을 변경하는 것도 좋을듯?
  };

  const movePuzzle = (x, y, index) => {
    config.tiles[index].position = new Point(x, y);
  };

  const unLockPuzzle = (x, y, index) => {
    console.log(x, y, index);
    // TODO: 여기서 Lock에 대한 UI처리를 해제한다.
  };

  const addPiece = ({ fromIndex, toIndex }) => {
    const afterUnitedConfig = uniteTiles({
      config,
      preIndex: fromIndex,
      nowIndex: toIndex,
    });
    const afterCheckItemConfig = removeItemStyleToPiece({
      config: afterUnitedConfig,
      fromIndex,
      toIndex,
    });
    config = afterCheckItemConfig;
  };

  const addCombo = (fromIndex, toIndex, direction) => {
    // console.log("addCombo 함수 실행 :", fromIndex, toIndex, direction, dir);
    // console.log(config);

    const nextConfig = uniteTiles({
      config,
      nowIndex: fromIndex,
      preIndex: toIndex,
      isSender: false,
      isCombo: true,
      direction: switchDirection(direction),
    });

    config = nextConfig;
  };

  // 공격형 아이템 fire
  const usingItemFire = (bundles, targetList) => {
    // bundles의 인덱스만 담은 object
    const bundlesIdxList = [];

    bundles.forEach((group) => {
      const idxList = [];
      group.forEach((g) => {
        idxList.push(g.index);
      });
      bundlesIdxList.push(idxList);
    });

    // 불 지르기로 없어지는 타겟 list 그룹 해제
    config.groupTiles.forEach((gtile) => {
      // 일단 모두 그룹 해제
      gtile[1] = undefined;
      // target이면 랜덤 위치에 떨어뜨림
      if (targetList.includes(gtile[2])) {
        const randomX = Math.random() * 960 + 20;
        const randomY = Math.random() * 710 + 20;
        config.tiles[gtile[2]].position = new Point(randomX, randomY);
      }
    });

    // 남아있는 그룹 번호 다시 쓰기
    bundlesIdxList.forEach((list, groupNum) => {
      console.log(groupNum, "번째 그룹", list);
      list.forEach((i) => {
        console.log(config.groupTiles[i]);
        config.groupTiles[i][1] = groupNum;
      });
    });
  };

  // 공격형 아이템 rocket
  const usingItemRocket = (targetList) => {
    config.groupTiles.forEach((gtile) => {
      // target이면 그룹 해제 (undefined)
      if (targetList.includes(gtile[2])) {
        gtile[1] = undefined;

        const randomX = Math.random() * 1000;
        const randomY = Math.random() * 750;
        config.tiles[gtile[2]].position = new Point(randomX, randomY);
      }
    });
  };

  // 공격형 아이템 earthquake
  const usingItemEarthquake = (targetList, deleted) => {
    console.log(targetList, deleted);

    config.groupTiles.forEach((gtile) => {
      if (targetList.includes(gtile[2])) {
        const position = deleted[gtile[2]];
        config.tiles[gtile[2]].position = new Point(position[0], position[1]);
      }
    });
  };

  const usingItemFrame = (targetList) => {
    console.log(targetList);

    console.log(getConfig());
  };

  const usingItemMagnet = (targetList) => {
    console.log(targetList);
    const config = getConfig();

    const [targetPuzzleIndex, ...aroundPuzzleIndexList] = targetList;
    try {
      for (let direction = 0; direction < 4; direction += 1) {
        const puzzleIndex = aroundPuzzleIndexList[direction];
        if (puzzleIndex === -1) {
          continue;
        }

        uniteTiles({
          config,
          nowIndex: targetPuzzleIndex,
          preIndex: puzzleIndex,
          direction: switchDirection(direction),
          isCombo: true,
          isSender: false,
        });
      }

      // TODO: 새롭게 그룹화된 녀석들을 붙여줘야함.
      // 이미 "그룹" 인데 거리가 떨어져있다면 강제로 붙인다 ?
      // 그룹을 해제할 수는 없음 (서버에서 이미 그룹으로 묶어놓았기 때문에...)
      // 클라이언트에서 한번 그룹을 순회하면서 붙여버리기 ?
      // 그룹과 그룹을 붙이는 함수 개발 ?

      console.log(config);
    } catch (error) {
      console.log("자석 아이템을 사용할 퍼즐이 없어요.");
    }
  };

  return {
    initializePuzzle,
    initializePuzzle2,
    getConfig,
    lockPuzzle,
    movePuzzle,
    unLockPuzzle,
    addPiece,
    addCombo,
    usingItemFire,
    usingItemRocket,
    usingItemEarthquake,
    usingItemFrame,
    usingItemMagnet,
  };
};

export const configStore = createPuzzleConfig();

const switchDirection = (direction) => {
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
  return dir;
};
