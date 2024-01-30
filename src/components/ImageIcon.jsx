import styled from "styled-components";

export default function ImageIcon({ imageSource, size = "md", onClick }) {
  const width = widthMatcher[size];

  return (
    <Container width={width}>
      <img
        src={imageSource}
        style={{
          cursor: "pointer",
        }}
        onClick={onClick}
      />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: ${({ width }) => width};

  img {
    width: 100%;
    &:hover {
      animation: bounce 0.4s infinite alternate;
      transform-origin: bottom;

      @keyframes bounce {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(-10px); /* 튀는 정도 조절 */
        }
      }
    }
  }
`;

const widthMatcher = {
  sm: "30px",
  md: "45px",
  lg: "60px",
};
