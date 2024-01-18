import { useRef, useEffect, useState } from "react";
import paper, { Path, Point, Size, Group, Raster, Rectangle } from "paper";
// "https://m.prugna.co.kr/web/product/big/202211/9d7750409c1193bb10a15dcba01f3d6a.jpg"

// const imgSrc = "https://m.prugna.co.kr/web/product/big/202211/9d7750409c1193bb10a15dcba01f3d6a.jpg";
const imgSrc = "https://res.heraldm.com/content/image/2015/03/06/20150306001045_0.jpg";
// const imgWidth = 516;
// const imgHeight = 516;

// const config = {
//   imgName: "puzzle-image",
//   tileWidth: 64,
//   tilesPerRow: 10,
//   tilesPerColumn: 8,
//   imgWidth: imgWidth,
//   imgHeight: imgHeight,

// };

// let puzzle = null;
const levelSize = { 1: 100, 2: 200, 3: 300 };

const setConfig = (img, level, Paper) => {
  const originHeight = img.height;
  const originWidth = img.width;
  const imgWidth =
    originHeight >= originWidth
      ? Math.round((levelSize[level] * originWidth) / originHeight / 100) * 100
      : levelSize[level];
  const imgHeight =
    originHeight >= originWidth
      ? levelSize[level]
      : Math.round((levelSize[level] * originHeight) / originWidth / 100) * 100;
  const tileWidth = 20;
  const config = {
    originHeight: originHeight,
    originWidth: originWidth,
    imgWidth: img.width,
    imgHeight: img.height,
    tilesPerRow: Math.floor(imgWidth / tileWidth),
    tilesPerColumn: Math.floor(imgHeight / tileWidth),
    tileWidth: tileWidth,
    tileMarginWidth: tileWidth * 0.203125,
    level: level,
    imgName: "puzzleImage",
    groupTiles: [],
    shapes: [],
    tiles: [],
    complete: false,
    groupTileIndex: 0,
    project: Paper,
    puzzleImage: new Paper.Raster({
      source: imgSrc,
      position: Paper.view.center,
    }),
    tileIndexes: [],
    groupArr: [],
    selectIndex: -1,
  };
  return config;
};

export default function Canvas(props) {
  const canvasref = useRef(null);
  const configRef = useRef(null);

  useEffect(() => {
    const canvas = canvasref.current;
    paper.setup(canvas);
    const img = new Image();
    img.src = imgSrc;
    configRef.current = setConfig(img, 1, paper);
    // console.log(configRef.current);
    configRef.current.tiles = createTiles(
      configRef.current.tilesPerRow,
      configRef.current.tilesPerColumn,
      configRef
    );
    console.log(configRef.current);

    // draw1();
  }, []);

  return (
    <canvas ref={canvasref} id="canvas" width={screen.width * 0.8} height={screen.height * 0.8} />
  );
}

// const draw1 = () => {
//   let mypath = new Path();

//   paper.view.onMouseDown = (event) => {
//     mypath.strokeColor = "red";
//     mypath.strokeWidth = 3;
//   };

//   paper.view.onMouseDrag = (event) => {
//     mypath.add(event.point);
//   };

//   paper.view.draw();
// };

const getTileRaster = (sourceRaster, size, offset, configRef) => {
  const targetRaster = new configRef.current.project.Raster("empty");
  targetRaster.scale(0.5);
  targetRaster.position = new Point(-offset.x, -offset.y);

  return targetRaster;
};
// const getTileRaster = (sourceRaster, size, offset, configRef) => {
//   const targetRaster = new Raster("empty");
//   const tileWithMarginWidth = size.width + configRef.current.tileMarginWidth * 2;
//   const data = sourceRaster.getData(
//     new Rectangle(
//       offset.x - configRef.current.tileMarginWidth,
//       offset.y - configRef.current.tileMarginWidth,
//       tileWithMarginWidth,
//       tileWithMarginWidth
//     )
//   );
//   console.log(data);
//   targetRaster.setData(data, new Point(0, 0));
//   targetRaster.position = new Point(28, 36);
//   // console.log(targetRaster);
//   // console.log(targetRaster.position);
//   return targetRaster;
// };

function createTiles(xTileCount, yTileCount, configRef) {
  const tiles = [];
  const tileRatio = configRef.current.tileWidth / 100.0;

  const shapeArray = getRandomShapes(xTileCount, yTileCount);
  const tileIndexes = [];
  for (let y = 0; y < yTileCount; y++) {
    for (let x = 0; x < xTileCount; x++) {
      const shape = shapeArray[y * xTileCount + x];

      const mask = getMask(
        tileRatio,
        shape.topTab,
        shape.rightTab,
        shape.bottomTab,
        shape.leftTab,
        configRef.current.tileWidth
      );
      mask.opacity = 0.25;
      mask.strokeColor = "#fff";

      console.log(mask);
      console.log(mask.position);

      const cloneImg = configRef.current.puzzleImage.clone();
      console.log("cloneImg", cloneImg);
      const img = getTileRaster(
        // configRef.current.puzzleImage,
        cloneImg,
        new Size(configRef.current.tileWidth, configRef.current.tileWidth),
        new Point(configRef.current.tileWidth * x, configRef.current.tileWidth * y),
        // Math.max(
        //   configRef.current.imgWidth / configRef.current.originWidth,
        //   configRef.current.imgHeight / configRef.current.originHeight
        // ),
        configRef
      );

      const border = mask.clone();
      border.strokeColor = "#ccc";
      border.strokeWidth = 5;

      const tile = new Group(mask, border, img, border);
      tile.clipped = true;
      tile.opacity = 1;

      tile.shape = shape;
      tile.imagePosition = new Point(x, y);

      tiles.push(tile);
      tileIndexes.push(tileIndexes.length);
    }
  }

  for (let y = 0; y < yTileCount; y++) {
    for (let x = 0; x < xTileCount; x++) {
      const index1 = Math.floor(Math.random() * tileIndexes.length);
      const index2 = tileIndexes[index1];
      const tile = tiles[index2];
      tileIndexes.splice(index1, 1);
      const position = {
        x:
          paper.view.center._x -
          configRef.current.tileWidth +
          configRef.current.tileWidth * (x * 2 + (y % 2)) -
          configRef.current.puzzleImage.size.width,
        y:
          paper.view.center._y -
          configRef.current.tileWidth / 2 +
          configRef.current.tileWidth * y -
          configRef.current.puzzleImage.size.height / 2,
      };
      // const position =
      //   paper.view.center -
      //   new Point(configRef.current.tileWidth, configRef.current.tileWidth / 2) +
      //   new Point(
      //     configRef.current.tileWidth * (x * 2 + (y % 2)),
      //     configRef.current.tileWidth * y
      //   ) -
      //   new Point(
      //     configRef.current.puzzleImage.size.width,
      //     configRef.current.puzzleImage.size.height / 2
      //   );
      // console.log(
      //   "point1: ",
      //   new Point(configRef.current.tileWidth, configRef.current.tileWidth / 2)
      // );
      // console.log(
      //   "point2: ",
      //   new Point(configRef.current.tileWidth * (x * 2 + (y % 2)), configRef.current.tileWidth * y)
      // );
      // console.log(
      //   "point3: ",
      //   new Point(
      //     configRef.current.puzzleImage.size.width,
      //     configRef.current.puzzleImage.size.height / 2
      //   )
      // );

      console.log("position: ", position);
      const cellPosition = new Point(
        Math.round(position.x / configRef.current.tileWidth) + 1,
        Math.round(position.y / configRef.current.tileWidth) + 1
      );
      console.log("cellPosition: ", cellPosition);

      tile.position = cellPosition * configRef.current.tileWidth;
      tile.cellPosition = cellPosition;
      // tile.position = { x: 0, y: 0 };
      // tile.cellPosition = { x: 0, y: 0 };
      // console.log(tile);
    }
  }

  return tiles;
}

function getRandomShapes(width, height) {
  const shapeArray = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let topTab = undefined;
      let rightTab = undefined;
      let bottomTab = undefined;
      let leftTab = undefined;

      if (y == 0) topTab = 0;

      if (y == height - 1) bottomTab = 0;

      if (x == 0) leftTab = 0;

      if (x == width - 1) rightTab = 0;

      shapeArray.push({
        topTab: topTab,
        rightTab: rightTab,
        bottomTab: bottomTab,
        leftTab: leftTab,
      });
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const shape = shapeArray[y * width + x];

      const shapeRight = x < width - 1 ? shapeArray[y * width + (x + 1)] : undefined;

      const shapeBottom = y < height - 1 ? shapeArray[(y + 1) * width + x] : undefined;

      shape.rightTab = x < width - 1 ? getRandomTabValue() : shape.rightTab;

      if (shapeRight) shapeRight.leftTab = -shape.rightTab;

      shape.bottomTab = y < height - 1 ? getRandomTabValue() : shape.bottomTab;

      if (shapeBottom) shapeBottom.topTab = -shape.bottomTab;
    }
  }
  return shapeArray;
}

function getRandomTabValue() {
  return Math.pow(-1, Math.floor(Math.random() * 2));
}

const curvyCoords = [
  0, 0, 35, 15, 37, 5, 37, 5, 40, 0, 38, -5, 38, -5, 20, -20, 50, -20, 50, -20, 80, -20, 62, -5, 62,
  -5, 60, 0, 63, 5, 63, 5, 65, 15, 100, 0,
];

const getMask = (
  tileRatio,
  topTab,
  rightTab,
  bottomTab,
  leftTab,
  tileWidth,
  imgWidth,
  imgHeight
) => {
  // console.log("tabs: ", topTab, rightTab, bottomTab, leftTab);
  // if (!topTab || !rightTab || !bottomTab || !leftTab) return;
  const mask = new Path();

  const topLeftEdge = new Point(-imgWidth / 2, -imgHeight / 2);

  mask.moveTo(topLeftEdge);
  //Top
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = new Point(
      topLeftEdge.x + curvyCoords[i * 6 + 0] * tileRatio,
      topLeftEdge.y + topTab * curvyCoords[i * 6 + 1] * tileRatio
    );

    const p2 = new Point(
      topLeftEdge.x + curvyCoords[i * 6 + 2] * tileRatio,
      topLeftEdge.y + topTab * curvyCoords[i * 6 + 3] * tileRatio
    );

    const p3 = new Point(
      topLeftEdge.x + curvyCoords[i * 6 + 4] * tileRatio,
      topLeftEdge.y + topTab * curvyCoords[i * 6 + 5] * tileRatio
    );

    mask.cubicCurveTo(p1, p2, p3); // 곡선의 첫점, 중앙점, 끝점
  }

  //Right
  const topRightEdge = new Point(topLeftEdge.x + tileWidth, topLeftEdge.y);
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = new Point(
      topRightEdge.x - rightTab * curvyCoords[i * 6 + 1] * tileRatio,
      topRightEdge.y + curvyCoords[i * 6 + 0] * tileRatio
    );
    const p2 = new Point(
      topRightEdge.x - rightTab * curvyCoords[i * 6 + 3] * tileRatio,
      topRightEdge.y + curvyCoords[i * 6 + 2] * tileRatio
    );
    const p3 = new Point(
      topRightEdge.x - rightTab * curvyCoords[i * 6 + 5] * tileRatio,
      topRightEdge.y + curvyCoords[i * 6 + 4] * tileRatio
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  //Bottom
  const bottomRightEdge = new Point(topRightEdge.x, topRightEdge.y + tileWidth);
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = new Point(
      bottomRightEdge.x - curvyCoords[i * 6 + 0] * tileRatio,
      bottomRightEdge.y - bottomTab * curvyCoords[i * 6 + 1] * tileRatio
    );
    const p2 = new Point(
      bottomRightEdge.x - curvyCoords[i * 6 + 2] * tileRatio,
      bottomRightEdge.y - bottomTab * curvyCoords[i * 6 + 3] * tileRatio
    );
    const p3 = new Point(
      bottomRightEdge.x - curvyCoords[i * 6 + 4] * tileRatio,
      bottomRightEdge.y - bottomTab * curvyCoords[i * 6 + 5] * tileRatio
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  //Left
  const bottomLeftEdge = new Point(bottomRightEdge.x - tileWidth, bottomRightEdge.y);
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = new Point(
      bottomLeftEdge.x + leftTab * curvyCoords[i * 6 + 1] * tileRatio,
      bottomLeftEdge.y - curvyCoords[i * 6 + 0] * tileRatio
    );
    const p2 = new Point(
      bottomLeftEdge.x + leftTab * curvyCoords[i * 6 + 3] * tileRatio,
      bottomLeftEdge.y - curvyCoords[i * 6 + 2] * tileRatio
    );
    const p3 = new Point(
      bottomLeftEdge.x + leftTab * curvyCoords[i * 6 + 5] * tileRatio,
      bottomLeftEdge.y - curvyCoords[i * 6 + 4] * tileRatio
    );

    mask.cubicCurveTo(p1, p2, p3);
  }
  console.log(mask);
  return mask;
};
