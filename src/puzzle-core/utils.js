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
