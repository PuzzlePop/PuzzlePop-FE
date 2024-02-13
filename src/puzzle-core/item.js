import { Color } from "paper/dist/paper-core";

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
  const N = config.redPuzzle.board.length;
  const M = config.redPuzzle.board[0].length;

  const frameIndexSet = new Set(targetList);

  const visited = Array.from({ length: N }, () => new Array(M).fill(false));
  const validateRange = (nx, ny) => {
    return 0 <= nx && nx < N && 0 <= ny && ny < M;
  };
  const dx = [-1, 0, 1, 0];
  const dy = [0, -1, 0, 1];

  const queue = [[0, 0]];

  while (queue.length > 0) {
    const [x, y] = queue.shift();
    for (let i = 0; i < 4; i += 1) {
      const nx = x + dx[i];
      const ny = y + dy[i];

      // 범위를 벗어나거나 이미 방문한 곳이라면 pass
      if (!validateRange(nx, ny) || visited[nx][ny]) {
        continue;
      }
    }
  }
};
