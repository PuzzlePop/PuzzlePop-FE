import { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import Paper from "paper";
import Puzzle from "@/components/PlayPuzzle/PuzzleCanvas/Puzzle/index";
import { createTiles } from "@/components/PlayPuzzle/PuzzleCanvas/Puzzle/CreatePuzzle";
import { config } from "./Puzzle/MovePuzzle";
import { Point } from "paper/dist/paper-core";

// level 임의로 3단계로
const levelSize = { 1: 500, 2: 600, 3: 800 };

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
  const tileWidth = 100;

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
  Puzzle.setting(config);
};

const PuzzleCanvas = (props) => {
  const canvasRef = useRef(null);
  const { puzzleImg, level } = props;
  // eslint-disable-next-line
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

    console.log(config);
  }, [level, puzzleImg]);

  return (
    <>
      <div style={{ width: "100vw", display: "flex", justifyContent: "center" }}>
        {showCanvas ? (
          <Canvas ref={canvasRef} id="canvas" />
        ) : (
          <img src={puzzleImg.current.src} alt="puzzleImage" />
        )}
      </div>
    </>
  );
};

const Canvas = styled.canvas`
  width: 2580px;
  height: 1440px;
  border: 1px solid #ccc;
`;

export default PuzzleCanvas;
