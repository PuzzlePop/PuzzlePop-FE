import { useRef, useEffect, useState } from "react";
import Paper from "paper";
import Puzzle from "./puzzle/index";
import { createTiles } from "./puzzle/createPuzzle";

// level 임의로 3단계로
const levelSize = { 1: 400, 2: 500, 3: 600 };

const setConfig = (img, level, Paper) => {
  const originHeight = img.current.height;
  const originWidth = img.current.width;
  const imgWidth =
    originHeight >= originWidth
      ? Math.round((levelSize[level] * originWidth) / originHeight / 100) * 100
      : levelSize[level];
  const imgHeight =
    originHeight >= originWidth
      ? levelSize[level]
      : Math.round((levelSize[level] * originHeight) / originWidth / 100) * 100;
  const tileWidth = 50;

  const config = {
    originHeight: originHeight, // 실제 사진의 높이
    originWidth: originWidth, // 실제 사진의 너비
    imgWidth: imgWidth, // canvas에 나타날 이미지의 너비
    imgHeight: imgHeight, // canvas에 나타날 이미지의 높이
    tilesPerRow: Math.floor(imgWidth / tileWidth), // 한 행당 피스 개수
    tilesPerColumn: Math.floor(imgHeight / tileWidth), // 한 열당 피스 개수
    tileWidth: tileWidth, // 한 피스의 길이 (피스는 정사각형)
    tileMarginWidth: tileWidth * 0.203125, // 피스가 딱 맞기 위한 margin 값
    level: level, // 난이도
    imgName: "puzzleImage", // img 태그의 id 값
    groupTiles: [], // 해당 피스와 그룹인 피스들 배열
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
  Puzzle.setting(config);
};

const PuzzleCanvas = (props) => {
  const canvasRef = useRef(null);
  const { puzzleImg, level } = props;
  const [showCanvas, setShowCanvas] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }
    Paper.setup(canvas);

    setConfig(puzzleImg, level, Paper);
    // console.log(Puzzle.exportConfig());
    createTiles();

    Puzzle.move();
  }, []);

  return (
    <div>
      {showCanvas ? (
        <canvas ref={canvasRef} id="canvas" width={props.width} height={props.height} />
      ) : (
        <img src={puzzleImg.current.src} alt="puzzleImage" />
      )}
    </div>
  );
};

export default PuzzleCanvas;
