import { Point } from "paper/dist/paper-core";
import Puzzle from "@/components/PlayPuzzle/PUzzleCanvas/Puzzle/index";
import FindChange from "@/components/PlayPuzzle/PUzzleCanvas/Puzzle/FindChange";

let first = true;
let config;

const moveTile = () => {
  config = Puzzle.exportConfig();
  config.groupTiles.forEach((gtile, index) => {
    if (gtile[1] === null) {
      gtile[1] = undefined;
    }
  });

  // 모든 타일을 돌면서 마우스 이벤트 등록
  config.groupTiles.forEach((gtile, gtileIdx) => {
    gtile[0].onMouseDown = (event) => {
      const group = gtile[1];
      if (group !== undefined) {
        // 그룹이면 해당 그룹의 타일들 모두 앞으로 이동
        config.groupTiles.forEach((tile) => {
          if (tile[1] === group) {
            tile[0].bringToFront();
          }
        });
      } else {
        // 그룹이 아닐땐 클릭된 타일만 앞으로 이동
        event.target.bringToFront();
      }
    };

    gtile[0].onMouseDrag = (event) => {
      // 캔버스 사이즈를 벗어나지 않는 범위내로 이동
      const newPosition = {
        x: Math.min(
          Math.max(gtile[0].position._x + event.delta.x, Math.floor(config.tileWidth / 2)),
          config.project.view._viewSize._width - Math.floor(config.tileWidth / 2),
        ),
        y: Math.min(
          Math.max(gtile[0].position._y + event.delta.y, Math.floor(config.tileWidth / 2)),
          config.project.view._viewSize._height - Math.floor(config.tileWidth / 2),
        ),
      };

      const originalPosition = {
        x: gtile[0].position._x,
        y: gtile[0].position._y,
      };

      if (gtile[1] === undefined) {
        gtile[0].position = new Point(newPosition.x, newPosition.y);
      } else {
        config.groupTiles.forEach((gtile_now) => {
          if (gtile[1] === gtile_now[1]) {
            gtile_now[0].position = new Point(
              gtile_now[0].position._x + newPosition.x - originalPosition.x,
              gtile_now[0].position._y + newPosition.y - originalPosition.y,
            );
          }
        });
      }
    };
  });
};

const moveUpdate = (tileIndex, tilePosition, tileGroup) => {
  config = Puzzle.exportConfig();
  if (config !== undefined) {
    config.tiles[tileIndex].position = new Point(tilePosition[1], tilePosition[2]);
    config.groupTiles[tileIndex][1] = tileGroup;
  }
};

const indexUpdate = (groupIndex) => {
  if (config !== undefined) {
    config.groupTileIndex = groupIndex;
  }
};

const findNearTileGroup = () => {
  config = Puzzle.exportConfig();

  config.groupTiles.forEach((tile, tileIndex) => {
    tile[0].onMouseUp = (event) => {
      const group = tile[1];
      if (group !== undefined) {
        config.groupTiles.forEach((gtile) => {
          if (gtile[1] === group && gtile[2] !== tile[2]) {
            findNearTile(gtile);
          }
        });
      }
      findNearTile(tile);
    };
  });
};

const findNearTile = (tile, flag = true) => {
  const xTileCount = config.tilesPerRow;
  const yTileCount = config.tilesPerColumn;

  const nowIndex = tile[2];

  const nextIndexArr = [
    nowIndex % xTileCount === 0 ? -1 : nowIndex - 1,
    (nowIndex + 1) % xTileCount === 0 ? -1 : nowIndex + 1,
    nowIndex - xTileCount < 0 ? -1 : nowIndex - xTileCount,
    nowIndex + xTileCount >= xTileCount * yTileCount ? -1 : nowIndex + xTileCount,
  ];

  const tileArr = []; // 맞춰야하는 피스 그룹 들어감 (좌우상하 순)
  const tileShape = []; // 맞춰야하는 피스의 탭 모양 들어감 (좌우상하 순)
  const nowShape = config.shapes[nowIndex];

  nextIndexArr.forEach((nextIndex, index) => {
    // 해당 방향에서 (0: 좌, 1: 우, 2: 상, 3: 하)
    // 피스가 이미 맞춰졌거나 테두리 방향이라면
    if (!checkUndefined(nowIndex, nextIndex, index)) {
      tileArr[index] = undefined;
    } else {
      // 아니라면, 즉 피스가 더 들어와야 한다면
      tileArr[index] = config.tiles[nextIndex];
      tileShape[index] = config.shapes[nextIndex];
    }
  });
  // console.log(tileArr, tileShape);
  tileArr.forEach((nowIndexTile, index) => {
    if (nowIndexTile !== undefined) {
      // console.log(tile);
      fitTiles(
        tile[2],
        nextIndexArr[index],
        tile[0],
        nowIndexTile,
        nowShape,
        tileShape[index],
        index,
        flag,
        tile[0].bounds.width,
      );
    }
  });
};

// 현재 피스에서 상하좌우 각 방향(direction)에서 비어있으면 true 아니면 false 반환
// 왼쪽에 피스가 맞춰져있고, 위쪽이 직선인 피스인 경우
// false true false true 가 반환됨 (위에서 forEach로 4방향 탐색)
const checkUndefined = (nowIndex, nextIndex, direction) => {
  let flag = true;
  const xTileCount = config.tilesPerRow;
  const yTileCount = config.tilesPerColumn;
  const groupTiles = config.groupTiles;

  const nowTile = groupTiles[nowIndex];
  const nextTile = groupTiles[nextIndex];
  // console.log(groupTiles, nowIndex, nowTile, nextIndex, nextTile);
  if (nextTile !== undefined && nowTile !== undefined) {
    const nowGroup = nowTile[1];
    const nextGroup = nextTile[1];
    if (nowGroup !== undefined && nextGroup === nowGroup) {
      flag = false;
    }
  }

  if (nowIndex % xTileCount === 0 && direction === 0) {
    flag = false;
  } else if (nowIndex % xTileCount === xTileCount - 1 && direction === 1) {
    flag = false;
  } else if (nowIndex < xTileCount && direction === 2) {
    flag = false;
  } else if (nowIndex >= xTileCount * (yTileCount - 1) && direction === 3) {
    flag = false;
  }

  return flag;
};

const fitTiles = (nowIndex, preIndex, nowTile, preTile, nowShape, preShape, dir, flag, width) => {
  const xChange = FindChange.findXChange(nowShape, preShape, width);
  const yChange = FindChange.findYChange(nowShape, preShape, width);
  const xUp = FindChange.findXUp(nowShape, preShape, width);
  const yUp = FindChange.findYUp(nowShape, preShape, width);

  if (flag === false) {
    console.log("fitTiles: ", nowIndex, preIndex);
    console.log("xChange, yChange, xUp, yUp: ", xChange, yChange, xUp, yUp);
  }
  const range = config.tileWidth;
  // 오차 범위
  const errorRange = range * 0.2;
  let uniteFlag = false;

  switch (dir) {
    // 좌
    case 0:
      if (
        (Math.abs(nowTile.position._x - range - preTile.position._x) < errorRange &&
          Math.abs(nowTile.position._y - preTile.position._y) < errorRange) ||
        flag === false
      ) {
        console.log("좌", nowTile.position, range, xChange, yChange);
        nowTile.position = new Point(
          preTile.position._x + range + xChange,
          preTile.position._y + yChange,
        );
        console.log(nowTile.position);
        uniteFlag = true;
      }
      break;
    // 우
    case 1:
      if (
        (Math.abs(preTile.position._x - range - nowTile.position._x) < errorRange &&
          Math.abs(nowTile.position._y - preTile.position._y) < errorRange) ||
        flag === false
      ) {
        console.log("우", nowTile.position, range, xChange, yChange);
        nowTile.position = new Point(
          preTile.position._x - (range + xChange),
          preTile.position._y + yChange,
        );
        console.log(nowTile.position);
        uniteFlag = true;
      }
      break;
    // 상
    case 2:
      if (
        (Math.abs(preTile.position._y + range - nowTile.position._y) < errorRange &&
          Math.abs(nowTile.position._x - preTile.position._x) < errorRange) ||
        flag === false
      ) {
        console.log("상", nowTile.position, range, xUp, yUp);
        nowTile.position = new Point(preTile.position._x + xUp, preTile.position._y + range + yUp);
        uniteFlag = true;
        console.log(nowTile.position);
      }
      break;
    // 하
    case 3:
      if (
        (Math.abs(nowTile.position._y + range - preTile.position._y) < errorRange &&
          Math.abs(nowTile.position._x - preTile.position._x) < errorRange) ||
        flag === false
      ) {
        // console.log("하", nowTile.position, range, xUp, yUp);
        nowTile.position = new Point(
          preTile.position._x + xUp,
          preTile.position._y - (range + yUp),
        );
        // console.log(nowTile.position);
        uniteFlag = true;
      }
      break;
  }

  // console.log("flag && uniteFlag: ", flag && uniteFlag);
  if (flag && uniteFlag) {
    uniteTiles(nowIndex, preIndex, nowTile, preTile);
  }
};

const uniteTiles = (nowIndex, preIndex) => {
  const nowGroup = config.groupTiles[nowIndex][1];
  const preGroup = config.groupTiles[preIndex][1];

  if (nowGroup !== undefined && !Number.isNaN(nowGroup)) {
    if (preGroup === undefined || Number.isNaN(preGroup)) {
      config.groupTiles[preIndex][1] = nowGroup;
    } else {
      config.groupTiles.forEach((gtile) => {
        if (gtile[1] === nowGroup) {
          gtile[1] = preGroup;
        }
      });
    }
  } else {
    if (preGroup !== undefined && !Number.isNaN(preGroup)) {
      config.groupTiles[nowIndex][1] = preGroup;
    } else {
      config.groupTiles[nowIndex][1] = config.groupTileIndex;
      config.groupTiles[preIndex][1] = config.groupTileIndex;
      if (config.groupTileIndex !== null && !Number.isNaN(config.groupTileIndex)) {
        config.groupTileIndex++;
      }
    }
  }
  // console.log(dismantling(config.groupTiles[preIndex][1]));
  if (!dismantling(config.groupTiles[preIndex][1])) {
    // console.log(config.groupTiles[preIndex][1]);
    groupFit(config.groupTiles[preIndex][1], nowIndex);
  }
};

const dismantling = (groupIndexNow) => {
  let count = 0;
  config.groupTiles.forEach((gtile) => {
    if (gtile[1] === groupIndexNow) {
      count++;
    }
  });
  if (count === 1) {
    config.groupTiles.forEach((gtile) => {
      if (gtile[1] === groupIndexNow) {
        gtile[1] = undefined;
        return true;
      }
    });
  }
  return false;
};

const groupFit = (nowGroup, nowIdx) => {
  const xTileCount = config.tilesPerRow;
  const yTileCount = config.tilesPerColumn;
  const groupArr = [];
  const groupObj = {};

  config.groupTiles.forEach((tile) => {
    const nowIndex = tile[2];
    if (tile[1] === nowGroup) {
      groupArr.push(tile);
      groupObj[nowIndex] = tile[0];
    }
  });

  if (groupArr.length === 1) {
    return;
  }

  groupArr.forEach((tile) => {
    const nowIndex = tile[2];

    const up = nowIndex - xTileCount < 0 ? undefined : nowIndex - xTileCount;
    const left = nowIndex % xTileCount === 0 ? undefined : nowIndex - 1;
    const right = nowIndex % xTileCount === xTileCount - 1 ? undefined : nowIndex + 1;
    const down = nowIndex >= xTileCount * (yTileCount - 1) ? undefined : nowIndex + xTileCount;

    const directionArr = [
      [left, 0],
      [right, 1],
      [up, 2],
      [down, 3],
    ];

    let index = 0;
    directionArr.forEach((dir, idx) => {
      if (
        dir[0] !== undefined &&
        dir[1] !== undefined &&
        groupObj[dir[0]] !== undefined &&
        index < 1 &&
        nowIndex !== nowIdx
      ) {
        fitTiles(
          nowIndex,
          dir[0],
          tile[0],
          groupObj[dir[0]],
          config.shapes[nowIndex],
          config.shapes[dir[0]],
          dir[1],
          false,
          tile[0].bounds.width,
        );
        index++;
      }
    });
  });
};

const checkComplete = () => {
  let flag = false;
  config = Puzzle.exportConfig();
  if (config !== undefined) {
    const firstGroup = config.groupTiles[0][1];

    if (firstGroup !== undefined) {
      flag = true;
      config.groupTiles.forEach((gtile) => {
        const nowGroup = gtile[1];
        if (nowGroup !== firstGroup) {
          flag = false;
        }
      });
    }
  }
  if (flag && !config.complete) {
    config.complete = true;
  } else {
    flag = false;
  }
  return flag;
};

const MovePuzzle = {
  moveTile,
  findNearTileGroup,
  moveUpdate,
  checkComplete,
  indexUpdate,
};
export default MovePuzzle;
