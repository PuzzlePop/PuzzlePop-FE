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

  const setPuzzle = (img = "https://img.onnada.com/2022/0202/5f21eef217.jpg") => {
    const res = {
      // 임시 데이터
      // 추후에 API 붙일때 여기 붙이기
      img: img,
      level: 3,
    };
    setPuzzleInfo({ crossOrigin: "anonymous", img: res.img, level: res.level });
    console.log("in setPuzzle: ", puzzleInfo, loaded);
  };

  useEffect(() => {
    console.log(loaded);
    setPuzzle(
      "https://i.namu.wiki/i/1zQlFS0_ZoofiPI4-mcmXA8zXHEcgFiAbHcnjGr7RAEyjwMHvDbrbsc8ekjZ5iWMGyzJrGl96Fv5ZIgm6YR_nA.webp",
    );
    console.log(loaded, puzzleInfo);
  }, []);

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
        {loaded && <PuzzleCanvas puzzleImg={imgRef} level={puzzleInfo.level} />}
      </div>
    </div>
  );
};

export default PlayPuzzle;
