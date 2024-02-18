import { useEffect, useState } from "react";
import styled from "styled-components";
import { match } from "../_lib/utils";
import num3 from "../assets/num_3.png";
import num2 from "../assets/num_2.png";
import num1 from "../assets/num_1.png";

export default function FromWaitingRoomToIngameLoading({ cb }) {
  const [time, setTime] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    if (time === 0 && cb) {
      cb();
    }

    return () => {
      clearInterval(interval);
    };
  }, [time, cb]);

  return (
    <Container>
      <Top>{`곧 게임이 시작돼요!`}</Top>
      <CounterContainer>
        <img src={getImageSource(time) || null} />
      </CounterContainer>
    </Container>
  );
}

const imageMatcher = {
  3: num3,
  2: num2,
  1: num1,
};
const getImageSource = match(imageMatcher);

const Container = styled.div`
  box-sizing: border-box;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
`;

const Top = styled.div`
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.4);
  font-size: 50px;
  color: white;
`;

const IMAGE_WIDTH = 600;

const CounterContainer = styled.div`
  position: absolute;
  top: calc(50% - ${IMAGE_WIDTH / 2}px);
  left: calc(50% - ${IMAGE_WIDTH / 2}px);
  width: ${IMAGE_WIDTH}px;
  height: ${IMAGE_WIDTH}px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

// const Messages = [
//   "알고 계셨나요? 배틀모드에서 랜덤으로 생성되는 풍선 아이콘을 클릭하면 특수 아이템을 얻을 수 있어요.",
//   "곧 게임이 시작돼요!",
// ];

// const getRandomMessage = () => {
//   const randomIndex = Math.floor(Math.random() * Messages.length);
//   return Messages[randomIndex];
// };
