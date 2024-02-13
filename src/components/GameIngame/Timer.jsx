import { useState, useEffect } from "react";
import styled from "styled-components";
import { getTeam } from "@/socket-utils/storage";
import { Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, blue, deepPurple } from "@mui/material/colors";

export default function Timer({ num, isCooperation = false }) {
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);

  const teamColor = isCooperation ? deepPurple[300] : getTeam() === "red" ? red[300] : blue[300];

  useEffect(() => {
    setMin(Math.floor(num / 60));
    const tempSec = num % 60;

    if (tempSec <= 9) {
      setSec("0" + tempSec);
    } else {
      setSec(tempSec);
    }
  }, [num]);

  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <Typography variant="h3" sx={{ color: teamColor }}>
          {min} : {sec}
        </Typography>
      </Wrapper>
    </ThemeProvider>
  );
}

const Wrapper = styled.div`
  margin-bottom: 20px;
`;
