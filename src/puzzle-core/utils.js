export const getPuzzlePositionByIndex = ({ config, puzzleIndex }) => {
  const x = config.groupTiles[puzzleIndex][0].position.x;
  const y = config.groupTiles[puzzleIndex][0].position.y;
  return [x, y];
};
