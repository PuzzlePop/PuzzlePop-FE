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
  const nextConfig = { ...config };
  itemList.forEach(({ targetPuzzleIndex }) => {
    nextConfig.tiles.forEach((tile, tileIndex) => {
      if (targetPuzzleIndex === tileIndex) {
        // 여기서 퍼즐에 스타일을 부여한다... 그런데 좀 반짝반짝 빛나는 효과는 못 주려나?
        // 참고: http://paperjs.org/reference/style/#strokecolor
        tile.strokeColor = new Color(1, 0, 0); // R,G,B (현재 빨간색)
      }
    });
  });
  return { ...nextConfig };
};

export const removeItemStyleToPiece = ({ config, fromIndex, toIndex }) => {
  const nextConfig = { ...config };
  nextConfig.tiles.forEach((tile, tileIndex) => {
    if (fromIndex === tileIndex || toIndex === tileIndex) {
      tile.strokeColor = undefined;
    }
  });
  return { ...nextConfig };
};
