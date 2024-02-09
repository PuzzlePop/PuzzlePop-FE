import styled from "styled-components";
import { Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import loadingPath from "@/assets/loading.gif";

export default function Loading({ message }) {
  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <LoadingImg src={loadingPath} />
        <Typography
          variant="h5"
          sx={{ marginLeft: "20px", marginTop: "20px", color: "#777", fontWeight: "bold" }}
        >
          {message}
        </Typography>
      </Wrapper>
    </ThemeProvider>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  height: 90vh;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingImg = styled.img`
  width: 300px;
`;
