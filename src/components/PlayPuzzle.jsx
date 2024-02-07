import { useCallback, useEffect, useRef, useState } from "react";
import PuzzleCanvas from "./PuzzleCanvas";

const PlayPuzzle = ({ category, shapes, board }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);
  const [puzzleInfo, setPuzzleInfo] = useState({
    crossOrigin: "anonymous",
    img: "",
    level: 1,
  });

  const onLoad = () => setLoaded(true);

  const initialize = useCallback(() => {
    const res = {
      // 임시 데이터
      // 추후에 API 붙일때 여기 붙이기
      img: "https://i.namu.wiki/i/1zQlFS0_ZoofiPI4-mcmXA8zXHEcgFiAbHcnjGr7RAEyjwMHvDbrbsc8ekjZ5iWMGyzJrGl96Fv5ZIgm6YR_nA.webp",
      level: 3,
    };
    setPuzzleInfo({ crossOrigin: "anonymous", img: res.img, level: res.level });
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div>
      <div>
        <img
          ref={imgRef}
          id="puzzleImage"
          src={puzzleInfo.img}
          alt="puzzleImage"
          onLoad={onLoad}
          style={{ display: "none" }}
        />
        <img id="empty" src={puzzleInfo.img} alt="emptyImage" style={{ display: "none" }} />
        {loaded && (
          <PuzzleCanvas
            category={category}
            puzzleImg={imgRef}
            level={puzzleInfo.level}
            shapes={shapes}
            board={board}
          />
        )}
      </div>
    </div>
  );
};

export default PlayPuzzle;
