export const getPuzzleGroup = ({ config, paperEvent }) => {
  const puzzleUniqueId = paperEvent.target.id;
  const puzzle = config.groupTiles.find((tile) => tile[0].id === puzzleUniqueId);

  if (puzzle[1] === undefined) {
    const { x, y } = puzzle[0].position;
    return [{ x, y, index: puzzle[2] }];
  }

  const groupId = puzzle[1];
  const group = [];
  for (let index = 0; index < config.groupTiles.length; index += 1) {
    const tile = config.groupTiles[index];
    if (tile[1] === groupId) {
      const { x, y } = tile[0].position;
      group.push({ x, y, index });
    }
  }
  return group;
};
