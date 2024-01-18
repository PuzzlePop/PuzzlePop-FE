import { useRef, useEffect } from "react";
import img1 from "../../assets/1.png";
import img2 from "../../assets/2.png";
import img3 from "../../assets/3.png";
import img4 from "../../assets/4.png";
// "https://m.prugna.co.kr/web/product/big/202211/9d7750409c1193bb10a15dcba01f3d6a.jpg"

export default function MovePuzzle() {
  const canvas = useRef(null);
  let getCtx = null;
  const isReady = useRef(false);

  // 임시 퍼즐 조각
  const imgList = [img1, img2, img3, img4];
  const imgListLength = imgList.length;
  const puzzleRowLength = 2;
  const puzzleColLength = 2;
  const totalPieceCount = puzzleRowLength * puzzleColLength;

  const canBoxes = useRef([]);

  let isMoveDown = false;
  let targetCanvas = null;
  let startX = null;
  let startY = null;

  useEffect(() => {
    if (canBoxes.current.length === 0) {
      for (let i = 0; i < imgListLength; i++) {
        const tempImg = new Image();
        tempImg.src = imgList[imgListLength - i - 1];

        const idx = imgListLength - i;
        const u = idx - puzzleRowLength <= 0 ? 0 : idx - puzzleRowLength;
        const d = idx + puzzleRowLength > totalPieceCount ? 0 : idx + puzzleRowLength;
        const l = idx % puzzleRowLength === 1 ? 0 : idx - 1;
        const r = idx % puzzleRowLength === 0 ? 0 : idx + 1;

        canBoxes.current.push({
          img: tempImg,
          x: Math.random() * 1000,
          y: Math.random() * 600,
          w: tempImg.width * 0.5,
          h: tempImg.height * 0.5,
          index: idx,
          neighbors: [u, d, l, r],
        });
      }
    }

    const canvasDimensions = canvas.current;
    if (canvasDimensions) {
      canvasDimensions.width = canvasDimensions.clientWidth;
      canvasDimensions.height = canvasDimensions.clientHeight;
      getCtx = canvasDimensions.getContext("2d");
    }
    console.log(canBoxes.current);
    canvasDraw();
    isReady.current = true;
  }, []);

  const canvasDraw = () => {
    getCtx.clearRect(0, 0, canvas.current.clientWidth, canvas.current.clientHeight);

    canBoxes.current.map((info) => fillCanvas(info));
  };

  const fillCanvas = (info) => {
    const { img, x, y, w, h } = info;
    getCtx.drawImage(img, x, y, w, h);
  };

  const moveableItem = (x, y) => {
    let isCanvasTarget = null;

    // 맨 위에 있는 피스를 움직이기 위해 뒤에서 부터 탐색
    for (let i = canBoxes.current.length - 1; i >= 0; i--) {
      // x, y 좌표로 클릭한 피스를 찾음
      const block = canBoxes.current[i];
      if (x >= block.x && x <= block.x + block.w && y >= block.y && y <= block.y + block.h) {
        targetCanvas = block;
        isCanvasTarget = true;

        // 클릭한 피스가 제일 위로 오게 draw
        canBoxes.current.splice(i, 1);
        canBoxes.current.push(targetCanvas);
        canvasDraw();
        break;
      }
    }
    return isCanvasTarget;
  };

  const onMouseDown = (e) => {
    startX = parseInt(e.nativeEvent.offsetX - canvas.current.clientLeft);
    startY = parseInt(e.nativeEvent.offsetY - canvas.current.clientTop);
    isMoveDown = moveableItem(startX, startY);
  };

  const onMouseMove = (e) => {
    if (!isMoveDown) return;
    const mouseX = parseInt(e.nativeEvent.offsetX - canvas.current.clientLeft);
    const mouseY = parseInt(e.nativeEvent.offsetY - canvas.current.clientTop);
    const mouseStartX = mouseX - startX;
    const mouseStartY = mouseY - startY;
    startX = mouseX;
    startY = mouseY;
    targetCanvas.x += mouseStartX;
    targetCanvas.y += mouseStartY;

    canvasDraw(targetCanvas);
    isCorrectPiece(targetCanvas);
  };

  const onMouseUp = (e) => {
    // console.log(e, startX, startY);
    targetCanvas = null;
    isMoveDown = false;
  };

  const isCorrectPiece = (targetCanvas) => {
    // 상하좌우 퍼즐의 위치 파악, 가까이 있으면 true 반환
    // paper.js 쓰면 거리 계산을 다른 방식으로 해야할듯
    for (let i = 0; i < 4; i++) {
      if (targetCanvas.neighbors[i]) {
        const neighborNum = targetCanvas.neighbors[i];
        const neighbor = canBoxes.current.find((e) => e.index === neighborNum);

        if (i === 0) {
          // console.log(i, neighborNum, neighbor);
          // console.log(Math.abs(neighbor.y + neighbor.h - targetCanvas.y));
          if (
            Math.abs(neighbor.y + neighbor.h - targetCanvas.y) < 0.5 &&
            Math.abs(neighbor.x - targetCanvas.x) < 0.5
          ) {
            console.log(true, "상");
          }
        }
        if (i === 1) {
          // console.log(i, neighborNum, neighbor);
          // console.log(neighbor.y - targetCanvas.y - targetCanvas.h));
          if (
            Math.abs(neighbor.y - targetCanvas.y - targetCanvas.h) < 0.5 &&
            Math.abs(neighbor.x - targetCanvas.x) < 0.5
          ) {
            console.log(true, "하");
          }
        }
        if (i === 2) {
          // console.log(i, neighborNum, neighbor);
          // console.log(Math.abs(neighbor.x + neighbor.w - targetCanvas.x));
          if (
            Math.abs(neighbor.x + neighbor.w - targetCanvas.x) < 0.5 &&
            Math.abs(neighbor.y - targetCanvas.y) < 0.5
          ) {
            console.log(true, "좌");
          }
        }
        if (i === 3) {
          // console.log(i, neighborNum, neighbor);
          // console.log(Math.abs(neighbor.x - targetCanvas.x - targetCanvas.w));
          if (
            Math.abs(neighbor.x - targetCanvas.x - targetCanvas.w) < 0.5 &&
            Math.abs(neighbor.y - targetCanvas.y) < 0.5
          ) {
            console.log(true, "우");
          }
        }
      }
    }
  };

  return (
    <div>
      <h2>Puzzle Pop</h2>
      {isReady && (
        <canvas
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          ref={canvas}
          width={screen.width * 0.8}
          height={screen.height}
          style={{ backgroundColor: "lightgray" }}
        ></canvas>
      )}
    </div>
  );
}
