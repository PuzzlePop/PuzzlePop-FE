import { socket } from "../socket-utils/socket";
import { getRoomId, getSender } from "../socket-utils/storage";
import { fitTiles } from "./findNearTileGroup";

const { send } = socket;

//ADD_PIECE
export const uniteTiles = ({
  config,
  nowIndex,
  preIndex,
  isSender = false,
  isCombo = false,
  direction = -1,
}) => {
  if (isSender) {
    send(
      "/app/game/message",
      {},
      JSON.stringify({
        type: "GAME",
        roomId: getRoomId(),
        sender: getSender(),
        message: "ADD_PIECE",
        targets: nowIndex.toString() + "," + preIndex.toString(),
      }),
    );

    // send(
    //   "/app/game/message",
    //   {},
    //   JSON.stringify({
    //     type: "GAME",
    //     roomId: getRoomId(),
    //     sender: getSender(),
    //     message: "GAME_INFO",
    //     targets: nowIndex.toString() + "," + preIndex.toString(),
    //   }),
    // );
  }

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

  // console.log(dismantling({ config, groupIndexNow: config.groupTiles[preIndex][1] }))
  if (!dismantling({ config, groupIndexNow: config.groupTiles[preIndex][1] })) {
    // console.log(config.groupTiles[preIndex][1]);
    if (isCombo) {
      comboFit({ config, nowIndex, preIndex, direction });
    } else {
      groupFit({ config, nowGroup: config.groupTiles[preIndex][1], nowIdx: nowIndex });
    }
  }

  return config;
};

export const dismantling = ({ config, groupIndexNow }) => {
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

export const comboFit = ({ config, nowIndex, preIndex, direction }) => {
  const nowTile = config.groupTiles[nowIndex][0];
  const preTile = config.groupTiles[preIndex][0];

  fitTiles({
    config,
    nowIndex: preIndex,
    preIndex: nowIndex,
    nowTile: preTile,
    preTile: nowTile,
    nowShape: config.shapes[preIndex],
    preShape: config.shapes[nowIndex],
    dir: direction,
    flag: false,
    width: nowTile.bounds.width,
    isCombo: true,
  });
};

export const groupFit = ({ config, nowGroup, nowIdx }) => {
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
        fitTiles({
          config,
          nowIndex,
          preIndex: dir[0],
          nowTile: tile[0],
          preTile: groupObj[dir[0]],
          nowShape: config.shapes[nowIndex],
          preShape: config.shapes[dir[0]],
          dir: dir[1],
          flag: false,
          width: tile[0].bounds.width,
        });
        index++;
      }
    });
  });
};
