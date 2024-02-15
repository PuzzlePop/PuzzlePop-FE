import { Color, Point } from "paper/dist/paper-core";
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
      tile.strokeColor = new Color("#ddd");
    }
  });
  return config;
};

export const itemMagnet = ({ config, targetList, bundles = [] }) => {
  const [targetPuzzleIndex, ...aroundPuzzleIndexList] = targetList;

  // 자석을 사용할 곳이 없다면 그냥 아무것도 안함
  if (aroundPuzzleIndexList.every((index) => index === -1)) {
    return config;
  }

  for (let direction = 0; direction < 4; direction += 1) {
    const puzzleIndex = aroundPuzzleIndexList[direction];
    if (puzzleIndex === -1) {
      continue;
    }

    const unitedConfig = uniteTiles2({
      config,
      nowIndex: targetPuzzleIndex,
      preIndex: puzzleIndex,
      direction: switchDirection(direction),
    });

    const updatedConfig = updateGroupByBundles({ config: unitedConfig, bundles });
    config = cleanBorderStyle({ config: updatedConfig });
  }

  return config;
};

export const itemFrame = ({ config, bundles, targetList }) => {
  const attach = ({ fromIndex, toIndex, direction }) => {
    const unitedConfig = uniteTiles2({
      config,
      preIndex: fromIndex,
      nowIndex: toIndex,
      direction: switchDirection(direction),
    });
    const updatedConfig = updateGroupByBundles({ config: unitedConfig, bundles });
    config = cleanBorderStyle({ config: updatedConfig });
  };

  const visited = new Set(); // 순회한 퍼즐인덱스
  const isSameBundle = (bundleSet, puzzleIndex) => bundleSet.has(puzzleIndex);

  // BFS
  const processBundle = (bundle) => {
    const result = [];
    const bundleSet = new Set(bundle.map((b) => b.index));
    const q = [];

    for (const p of bundle) {
      if (!visited.has(p.index)) {
        visited.add(p.index);
        q.push(p);
      }

      while (q.length > 0) {
        const puzzle = q.shift();
        const {
          index: currentPuzzleIndex,
          correctTopIndex,
          correctBottomIndex,
          correctLeftIndex,
          correctRightIndex,
        } = puzzle;

        result.push(currentPuzzleIndex);

        // 상우하좌로 순회
        const aroundPuzzles = [
          correctTopIndex,
          correctRightIndex,
          correctBottomIndex,
          correctLeftIndex,
        ];
        for (let direction = 0; direction < 4; direction += 1) {
          const neighborPuzzleIndex = aroundPuzzles[direction];

          // 순회할 수 없거나 같은 번들이 아니거나 이미 처리(방문)한 퍼즐이라면 패스
          if (
            neighborPuzzleIndex === -1 ||
            !isSameBundle(bundleSet, neighborPuzzleIndex) ||
            visited.has(neighborPuzzleIndex)
          ) {
            continue;
          }

          visited.add(neighborPuzzleIndex);
          q.push(bundle.find((b) => b.index === neighborPuzzleIndex));

          // console.log(`${neighborPuzzleIndex} 가 ${currentPuzzleIndex} 에 붙는다!`);
          attach({
            fromIndex: neighborPuzzleIndex,
            toIndex: currentPuzzleIndex,
            direction,
          });
        }
      }
    }

    return result;
  };

  bundles.forEach((bundle) => {
    const result = processBundle(bundle);
    // console.log(result);
  });

  return config;
};

export const itemFire = ({ config, targetList, bundles }) => {
  const attach = ({ fromIndex, toIndex, direction }) => {
    const unitedConfig = uniteTiles2({
      config,
      preIndex: fromIndex,
      nowIndex: toIndex,
      direction: switchDirection(direction),
    });
    const updatedConfig = updateGroupByBundles({ config: unitedConfig, bundles });
    config = cleanBorderStyle({ config: updatedConfig });
  };

  const visited = new Set(); // 순회한 퍼즐인덱스
  const isSameBundle = (bundleSet, puzzleIndex) => bundleSet.has(puzzleIndex);

  // BFS
  const processBundle = (bundle) => {
    const result = [];
    const bundleSet = new Set(bundle.map((b) => b.index));
    const q = [];

    for (const p of bundle) {
      if (!visited.has(p.index)) {
        visited.add(p.index);
        q.push(p);
      }

      while (q.length > 0) {
        const puzzle = q.shift();
        const {
          index: currentPuzzleIndex,
          correctTopIndex,
          correctBottomIndex,
          correctLeftIndex,
          correctRightIndex,
        } = puzzle;

        result.push(currentPuzzleIndex);

        // 상우하좌로 순회
        const aroundPuzzles = [
          correctTopIndex,
          correctRightIndex,
          correctBottomIndex,
          correctLeftIndex,
        ];
        for (let direction = 0; direction < 4; direction += 1) {
          const neighborPuzzleIndex = aroundPuzzles[direction];

          // 순회할 수 없거나 같은 번들이 아니거나 이미 처리(방문)한 퍼즐이라면 패스
          if (
            neighborPuzzleIndex === -1 ||
            !isSameBundle(bundleSet, neighborPuzzleIndex) ||
            visited.has(neighborPuzzleIndex)
          ) {
            continue;
          }

          visited.add(neighborPuzzleIndex);
          q.push(bundle.find((b) => b.index === neighborPuzzleIndex));

          // console.log(`${neighborPuzzleIndex} 가 ${currentPuzzleIndex} 에 붙는다!`);
          attach({
            fromIndex: neighborPuzzleIndex,
            toIndex: currentPuzzleIndex,
            direction,
          });
        }
      }
    }

    return result;
  };

  bundles.forEach((bundle) => {
    const result = processBundle(bundle); // 일단 bundles 대로 BFS

    config.groupTiles.forEach((gtile) => {
      // target이면 그룹 해제하고 랜덤 위치에 떨어뜨림
      if (targetList.includes(gtile[2])) {
        gtile[1] = undefined;
        const randomX = Math.random() * 960 + 20;
        const randomY = Math.random() * 710 + 20;
        config.tiles[gtile[2]].position = new Point(randomX, randomY);
      }
    });
  });

  return config;
};
