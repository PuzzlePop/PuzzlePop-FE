import { useState, useEffect } from "react";
import styled from "styled-components";

export default function Timer({ num }) {
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);

  useEffect(() => {
    setMin(Math.floor(num / 60));
    const tempSec = num % 60;

    if (tempSec <= 9) {
      setSec("0" + tempSec);
    } else {
      setSec(tempSec);
    }
  }, [num]);

  return (
    <Wrapper>
      <h1>
        {min} : {sec}
      </h1>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: fixed;
  z-index: 100;
  top: 30px;
  left: 50%;
  transform: translate(-50%, 0);
`;
