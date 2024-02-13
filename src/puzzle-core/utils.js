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
