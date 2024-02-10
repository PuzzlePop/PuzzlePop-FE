import { useRef, useEffect } from "react";
import styled from "styled-components";
import Paper from "paper";
import Puzzle from "@/components/PlayPuzzle/PuzzleCanvas/Puzzle/index";
import { createTiles } from "@/components/PlayPuzzle/PuzzleCanvas/Puzzle/CreatePuzzle";
import { configStore } from "../../../puzzle-core";

// level 임의로 3단계로
const levelSize = { 1: 500, 2: 600, 3: 800 };

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
  const tileWidth = 100;

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

  Puzzle.setting(config);

  return config;
};

const { initializePuzzle2 } = configStore;

export default function PuzzleCanvas({ puzzleImg, level, shapes, board, picture }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    Paper.setup(canvasRef.current);
    setConfig(puzzleImg, level, picture);
    // console.log(Puzzle.exportConfig());

    createTiles(shapes, board);
    Puzzle.move();
    initializePuzzle2(Puzzle.exportConfig());
    // initializePuzzle2(config)
  }, [level, puzzleImg, shapes, board, picture]);

  return (
    <>
      <div style={{ width: "100vw", display: "flex", justifyContent: "center" }}>
        <div id="canvasContainer" style={{ position: "relative" }}>
          <Canvas ref={canvasRef} id="canvas" />
        </div>
      </div>
    </>
  );
}

const Canvas = styled.canvas`
  width: 2580px;
  height: 1440px;
  border: 1px solid #ccc;
`;
