import Paper from "paper";
import { Size, Point } from "paper/dist/paper-core";
import { getRandomShapes } from "./getRandomShapes";

export const initializeConfig = ({ img, level, shapes, board, picture }) => {
  const config1 = setConfig(img, level, picture);
  const config2 = createTiles({ config: config1, shapes });
  const config3 = initConfig({ config: config2, board });
  return config3;
};

// level 임의로 3단계로
const levelSize = { 1: 400, 2: 500, 3: 600 };

const setConfig = (img, level, picture) => {
  const originHeight = picture.length;
  const originWidth = picture.width;
  const imgWidth =
    originHeight >= originWidth
      ? Math.round((levelSize[level] * originWidth) / originHeight / 100) * 100
      : levelSize[level];
  const imgHeight =
    originHeight >= originWidth
      ? levelSize[level]
      : Math.round((levelSize[level] * originHeight) / originWidth / 100) * 100;
  const tileWidth = 40;

  const config = {
    originHeight: originHeight, // 실제 사진의 높이
    originWidth: originWidth, // 실제 사진의 너비
    imgWidth: imgWidth, // canvas에 나타날 이미지의 너비
    imgHeight: imgHeight, // canvas에 나타날 이미지의 높이
    tilesPerRow: picture.widthPieceCnt, // 한 행당 피스 개수
    tilesPerColumn: picture.lengthPieceCnt, // 한 열당 피스 개수
    tileWidth: tileWidth, // 한 피스의 길이 (피스는 정사각형)
    tileMarginWidth: tileWidth * 0.203125, // 피스가 딱 맞기 위한 margin 값
    level: level, // 난이도
    imgName: "puzzleImage", // img 태그의 id 값
    groupTiles: [], // [피스Group, 해당 피스의 그룹 번호, 해당 피스의 정답인덱스]의 모음
    shapes: [], // 피스의 shape 정보들
    tiles: [], // 만들어진 피스들 배열
    complete: false, // 퍼즐 완성 여부
    groupTileIndex: 0,
    project: Paper, // paper 변수
    puzzleImage: new Paper.Raster({
      // paper.Raster 객체
      source: "puzzleImage",
      position: Paper.view.center,
    }),
    tileIndexes: [],
    groupArr: [],
    selectIndex: -1,
  };

  return config;
};

const createTiles = ({ config, shapes }) => {
  if (shapes && Array.isArray(shapes)) {
    // getRandomShapes();
    config.shapes = shapes;
  } else {
    getRandomShapes();
  }

  return config;
};

const constant = {
  percentageTotal: 100.0,
  borderStrokeWidth: 5,
  tileOpacity: 1,
  maskOpacity: 0.25,
  orgTileLoc: 100,
  tileMarginX: 0,
  tileMarginY: 30,
};

const initConfig = ({ config, board }) => {
  const tileRatio = config.tileWidth / constant.percentageTotal;
  for (let y = 0; y < config.tilesPerColumn; y++) {
    for (let x = 0; x < config.tilesPerRow; x++) {
      const shape = config.shapes[y * config.tilesPerRow + x];
      const mask = getMask(
        tileRatio,
        shape.topTab,
        shape.rightTab,
        shape.bottomTab,
        shape.leftTab,
        config.tileWidth,
        config.project,
        config.imgWidth,
        config.imgHeight,
      );
      if (mask === undefined) {
        continue;
      }
      mask.opacity = constant.maskOpacity;
      mask.strokeColor = new config.project.Color("#fff");

      const cloneImg = config.puzzleImage.clone();
      const img = getTileRaster({
        config,
        sourceRaster: cloneImg,
        size: new Size(config.tileWidth, config.tileWidth),
        offset: new Point(config.tileWidth * x, config.tileWidth * y),
        scaleValue: Math.max(
          config.imgWidth / config.originWidth,
          config.imgHeight / config.originHeight,
        ),
      });

      const border = mask.clone();
      border.strokeColor = new config.project.Color("#ddd");
      border.strokeWidth = constant.borderStrokeWidth;

      // 피스 생성
      const tile = new config.project.Group([mask, img, border]);
      tile.shadowColor = new config.project.Color("#666");
      tile.shadowBlur = 1;
      tile.shadowOffset = new Point(-1, -1);

      tile.clipped = true;
      tile.opacity = constant.tileOpacity;
      tile.position = new Point(constant.orgTileLoc, constant.orgTileLoc);
      config.tiles.push(tile);
      config.groupTiles.push([tile, undefined, config.tileIndexes.length]);
      config.groupArr.push(undefined);
      config.tileIndexes.push(config.tileIndexes.length);
      // console.log(config.tileIndexes);
    }
  }

  for (let y = 0; y < config.tilesPerColumn; y++) {
    for (let x = 0; x < config.tilesPerRow; x++) {
      const tileIndex = board[y][x].index;
      const tile = config.tiles[tileIndex];
      tile.position = new Point(board[y][x].position_x, board[y][x].position_y);
    }
  }

  return config;
};

// 들어갔는지 (-1) 나왔는지 (1)에 따라 curvy mask 계산
const getMask = (
  tileRatio,
  topTab,
  rightTab,
  bottomTab,
  leftTab,
  tileWidth,
  project,
  imgWidth,
  imgHeight,
) => {
  if (
    topTab === undefined ||
    rightTab === undefined ||
    bottomTab === undefined ||
    leftTab === undefined
  ) {
    return;
  }

  const curvyCoords = [
    0, 0, 35, 15, 37, 5, 37, 5, 40, 0, 38, -5, 38, -5, 20, -20, 50, -20, 50, -20, 80, -20, 62, -5,
    62, -5, 60, 0, 63, 5, 63, 5, 65, 15, 100, 0,
  ];

  const mask = new project.Path();
  const topLeftEdge = new Point(-imgWidth / 2, -imgHeight / 2);

  mask.moveTo(topLeftEdge);
  //Top
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = new Point(
      topLeftEdge.x + curvyCoords[i * 6 + 0] * tileRatio,
      topLeftEdge.y + topTab * curvyCoords[i * 6 + 1] * tileRatio,
    );

    const p2 = new Point(
      topLeftEdge.x + curvyCoords[i * 6 + 2] * tileRatio,
      topLeftEdge.y + topTab * curvyCoords[i * 6 + 3] * tileRatio,
    );

    const p3 = new Point(
      topLeftEdge.x + curvyCoords[i * 6 + 4] * tileRatio,
      topLeftEdge.y + topTab * curvyCoords[i * 6 + 5] * tileRatio,
    );

    mask.cubicCurveTo(p1, p2, p3); // 곡선의 첫점, 중앙점, 끝점
  }

  //Right
  const topRightEdge = new Point(topLeftEdge.x + tileWidth, topLeftEdge.y);
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = new Point(
      topRightEdge.x - rightTab * curvyCoords[i * 6 + 1] * tileRatio,
      topRightEdge.y + curvyCoords[i * 6 + 0] * tileRatio,
    );
    const p2 = new Point(
      topRightEdge.x - rightTab * curvyCoords[i * 6 + 3] * tileRatio,
      topRightEdge.y + curvyCoords[i * 6 + 2] * tileRatio,
    );
    const p3 = new Point(
      topRightEdge.x - rightTab * curvyCoords[i * 6 + 5] * tileRatio,
      topRightEdge.y + curvyCoords[i * 6 + 4] * tileRatio,
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  //Bottom
  const bottomRightEdge = new Point(topRightEdge.x, topRightEdge.y + tileWidth);
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = new Point(
      bottomRightEdge.x - curvyCoords[i * 6 + 0] * tileRatio,
      bottomRightEdge.y - bottomTab * curvyCoords[i * 6 + 1] * tileRatio,
    );
    const p2 = new Point(
      bottomRightEdge.x - curvyCoords[i * 6 + 2] * tileRatio,
      bottomRightEdge.y - bottomTab * curvyCoords[i * 6 + 3] * tileRatio,
    );
    const p3 = new Point(
      bottomRightEdge.x - curvyCoords[i * 6 + 4] * tileRatio,
      bottomRightEdge.y - bottomTab * curvyCoords[i * 6 + 5] * tileRatio,
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  //Left
  const bottomLeftEdge = new Point(bottomRightEdge.x - tileWidth, bottomRightEdge.y);
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = new Point(
      bottomLeftEdge.x + leftTab * curvyCoords[i * 6 + 1] * tileRatio,
      bottomLeftEdge.y - curvyCoords[i * 6 + 0] * tileRatio,
    );
    const p2 = new Point(
      bottomLeftEdge.x + leftTab * curvyCoords[i * 6 + 3] * tileRatio,
      bottomLeftEdge.y - curvyCoords[i * 6 + 2] * tileRatio,
    );
    const p3 = new Point(
      bottomLeftEdge.x + leftTab * curvyCoords[i * 6 + 5] * tileRatio,
      bottomLeftEdge.y - curvyCoords[i * 6 + 4] * tileRatio,
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  return mask;
};

// 각각의 피스의 raster 반환
const getTileRaster = ({ config, sourceRaster, size, offset, scaleValue }) => {
  const targetRaster = new config.project.Raster("empty");
  targetRaster.scale(scaleValue);
  targetRaster.position = new Point(-offset.x, -offset.y);

  return targetRaster;
};
