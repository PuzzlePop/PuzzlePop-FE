import { Color } from "paper/dist/paper-core";
import { uniteTiles2 } from "./uniteTiles";
import { cleanBorderStyle, switchDirection, updateGroupByBundles } from "./utils";

// return { targetPuzzleIndex: number; name: string; itemId: number }[]
export const searchItemList = (board) => {
  const result = [];
  for (let rowIndex = 0; rowIndex < board.length; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < board[0].length; columnIndex += 1) {
      const { item, index: targetPuzzleIndex } = board[rowIndex][columnIndex];
      if (!item) {
        continue;
      }
      const { id: itemId, name } = item;
      result.push({
        targetPuzzleIndex,
        name,
        itemId,
      });
    }
  }
  return result;
};

export const setItemStyleToAllPiece = ({ config, itemList }) => {
  itemList.forEach(({ targetPuzzleIndex }) => {
    config.tiles.forEach((tile, tileIndex) => {
      if (targetPuzzleIndex === tileIndex) {
        // 여기서 퍼즐에 스타일을 부여한다... 그런데 좀 반짝반짝 빛나는 효과는 못 주려나?
        // 참고: http://paperjs.org/reference/style/#strokecolor
        tile.strokeColor = new Color(1, 0, 0); // R,G,B (현재 빨간색)
      }
    });
  });
  return config;
};

export const removeItemStyleToPiece = ({ config, fromIndex, toIndex }) => {
  config.tiles.forEach((tile, tileIndex) => {
    if (fromIndex === tileIndex || toIndex === tileIndex) {
      tile.strokeColor = undefined;
    }
  });
  return config;
};

export const itemFrame = ({ config, bundles, targetList }) => {
  const sortedBundles = bundles.map((bundle) => [...bundle].sort((a, b) => a.index - b.index));

  for (const bundle of sortedBundles) {
    const bundleSet = new Set(bundle.map((item) => item.index));
    // 1. currentPuzzle을 prevPuzzle에 붙인다..
    // 2. 이미 순회했다면 방문처리..
    for (const puzzle of bundle) {
      const {
        index: currentPuzzleIndex,
        correctTopIndex,
        correctBottomIndex,
        correctLeftIndex,
        correctRightIndex,
      } = puzzle;

      bundleSet.delete(currentPuzzleIndex); // 방문처리

      // 상우하좌로 순회
      const aroundPuzzles = [
        correctTopIndex,
        correctRightIndex,
        correctBottomIndex,
        correctLeftIndex,
      ];
      for (let direction = 0; direction < 4; direction += 1) {
        const nextPuzzleIndex = aroundPuzzles[direction];

        // 범위를 벗어났거나 같은 그룹이 아니면 패스
        if (nextPuzzleIndex === -1 || !bundleSet.has(nextPuzzleIndex)) {
          continue;
        }

        // 같은 그룹이라면 nextPuzzleIndex를 방향에 맞게 currentPuzzleIndex에 붙인다.
        const unitedConfig = uniteTiles2({
          config,
          nowIndex: currentPuzzleIndex,
          preIndex: nextPuzzleIndex,
          direction: switchDirection(direction),
        });

        bundleSet.delete(nextPuzzleIndex); // 방문처리

        const updatedConfig = updateGroupByBundles({ config: unitedConfig, bundles });
        config = cleanBorderStyle({ config: updatedConfig });
      }
    }
  }

  return config;
};
