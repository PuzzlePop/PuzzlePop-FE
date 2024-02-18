import styled from "styled-components";

export default function ProgressBar({ percent, height = 50, isEnemy }) {
  const backgroundColor = isEnemy ? "tomato" : "royalblue";

  return (
    <StyledProgressBar>
      <Rail height={height} isEnemy={isEnemy} />
      <Track height={height} style={{ width: `${percent}%`, backgroundColor }} />
    </StyledProgressBar>
  );
}

const StyledProgressBar = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 30px;
`;

const Rail = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${({ height }) => height}px;
  border-radius: 2px;
  background-color: ${({ isEnemy }) => (isEnemy ? "#ef9292" : "#6a75c1")};
`;

const Track = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: ${({ height }) => height}px;
  border-radius: 2px;
  background-size: 20px 20px;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent 100%
  );

  animation: move 1000ms linear infinite;
  transition: width 100ms linear;

  @keyframes move {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 40px 0;
    }
  }
`;
