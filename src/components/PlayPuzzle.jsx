import { useCallback, useEffect, useRef, useState } from "react";
import PuzzleCanvas from "./PuzzleCanvas";

const PlayPuzzle = ({ category, shapes, board, picture }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);
  const [puzzleInfo, setPuzzleInfo] = useState({
    crossOrigin: "anonymous",
    img: "",
    level: 1,
  });

  const onLoad = () => setLoaded(true);

  const initialize = useCallback(() => {
    const img =
      picture.encodedString === "짱구.jpg"
        ? "https://i.namu.wiki/i/1zQlFS0_ZoofiPI4-mcmXA8zXHEcgFiAbHcnjGr7RAEyjwMHvDbrbsc8ekjZ5iWMGyzJrGl96Fv5ZIgm6YR_nA.webp"
        : `data:image/jpeg;base64,${picture.encodedString}`;
    const res = {
      img,
      level: 1,
    };
    setPuzzleInfo({ crossOrigin: "anonymous", img: res.img, level: res.level });

    // eslint-disable-next-line
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
            picture={picture}
          />
        )}
      </div>
    </div>
  );
};

export default PlayPuzzle;
