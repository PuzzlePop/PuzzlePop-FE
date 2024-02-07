import { Point } from "paper/dist/paper-core";

export const moveUpdate = ({ config, tileIndex, tilePosition, tileGroup }) => {
  if (config !== undefined) {
    config.tiles[tileIndex].position = new Point(tilePosition[1], tilePosition[2]);
    config.groupTiles[tileIndex][1] = tileGroup;
  }
  return { ...config };
};

export const indexUpdate = ({ config, groupIndex }) => {
  if (config !== undefined) {
    config.groupTileIndex = groupIndex;
  }
  return { ...config };
};
