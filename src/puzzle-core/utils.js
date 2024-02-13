import { Point } from "paper/dist/paper-core";
import { groupFit, uniteTiles2 } from "./uniteTiles";

export const getPuzzlePosition = (puzzle) => {
  if (puzzle.position) {
    return [puzzle[0].position.x, puzzle[0].position.y];
  }
  return [puzzle[0].children[0].position.x, puzzle[0].children[0].position.y];
};

export const getPuzzleByIndex = ({ config, puzzleIndex }) => {
  return config.groupTiles[puzzleIndex];
};

export const getPuzzlePositionByIndex = ({ config, puzzleIndex }) => {
  const puzzle = getPuzzleByIndex({ config, puzzleIndex });
  return getPuzzlePosition(puzzle);
};

export const updateAllUnGroups = ({ config }) => {
  config.groupTiles.forEach((gtile) => {
    gtile[1] = undefined;
  });
  return config;
};

export const updateGroupByBundles = ({ config, bundles }) => {
  // 일단 모두 그룹 해제
  config.groupTiles.forEach((gtile) => {
    gtile[1] = undefined;
  });

  // 남아있는 그룹 번호 다시 쓰기
  bundles
    .map((b) => b.map((item) => item.index))
    .forEach((bundle, bundleIndex) => {
      bundle.forEach((puzzleIndex, index) => {
        if (index + 1 < bundle.length) {
          uniteTiles2({
            config,
            nowIndex: bundle[index + 1],
            preIndex: puzzleIndex,
          });
        }
        config.groupTiles[puzzleIndex][1] = bundleIndex;
      });
    });

  return config;
};

export const cleanBorderStyle = ({ config }) => {
  // 그룹핑이 되어있는 퍼즐의 border style 다시 default로 되돌리기
  config.groupTiles.forEach((gtile, index) => {
    const isGrouping = gtile[1] !== undefined;
    if (isGrouping) {
      config.tiles[index].strokeColor = undefined;
    }
  });
  return config;
};

export const switchDirection = (direction) => {
  const directionChanger = {
    0: 3,
    1: 0,
    2: 2,
    3: 1,
  };
  const result = directionChanger[direction];
  return result === undefined ? -1 : result;
};

export const randomSprinkle = ({ config }) => {
  config = updateAllUnGroups({ config });

  config.tiles.forEach((_, index) => {
    const randomX = Math.random() * 960 + 20;
    const randomY = Math.random() * 710 + 20;
    config.tiles[index].position = new Point(randomX, randomY);
  });
};
