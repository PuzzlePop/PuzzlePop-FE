import styled from "styled-components";
import loadingPath from "@/assets/loading.gif";

export default function Loading() {
  return (
    <Wrapper>
      <LoadingImg src={loadingPath} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  height: 90vh;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingImg = styled.img`
  width: 300px;
`;
