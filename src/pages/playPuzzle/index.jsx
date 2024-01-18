import { useEffect, useRef, useState } from "react";
import PuzzleCanvas from "../../components/playPuzzle/puzzleCanvas/index";

const PlayPuzzle = () => {
  const [loaded, setLoaded] = useState(false);
  const [puzzleInfo, setPuzzleInfo] = useState({
    crossOrigin: "anonymous",
    img: "",
    level: 1,
  });

  const imgRef = useRef(null);
  const onLoad = () => setLoaded(true);

  const setPuzzle = () => {
    const res = {
      // 임시 데이터
      // 추후에 API 붙일때 여기 붙이기
      img: "https://img.onnada.com/2022/0202/5f21eef217.jpg",
      level: 3,
    };
    setPuzzleInfo({ img: res.img, level: res.level });
  };

  useEffect(() => {
    setPuzzle();
    setLoaded(true);
  }, []);

  return (
    <div>
      <div>
        {loaded && (
          <>
            <img
              ref={imgRef}
              id="puzzleImage"
              src={puzzleInfo.img}
              alt="puzzleImage"
              onLoad={onLoad}
              style={{ display: "none" }}
            />
            <img
              id="empty"
              src={puzzleInfo.img}
              alt="emptyImage"
              onLoad={onLoad}
              style={{ display: "none" }}
            />
            <PuzzleCanvas
              puzzleImg={imgRef}
              level={puzzleInfo.level}
              width={screen.width}
              height={screen.height}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PlayPuzzle;
