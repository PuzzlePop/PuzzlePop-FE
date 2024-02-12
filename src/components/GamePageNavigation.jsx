import { useState } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { Box, Tabs, Tab } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";

export default function GamePageNavigation() {
  const url = useLocation().pathname.split("/")[2] || "cooperation";
  const isGame = useLocation().pathname.split("/")[1] === "game" ? true : false;
  const [value, setValue] = useState(url);

  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
    components: {
      MuiTabs: {
        styleOverrides: {
          root: {
            height: "100%",
          },
          indicator: {
            backgroundColor: deepPurple[700],
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            fontSize: "20px",
            color: deepPurple[500],
            padding: "20px 0",
            "&:hover": {
              backgroundColor: deepPurple[200],
              color: deepPurple[700],
            },
          },
        },
      },
    },
  });

  return (
    <Container>
      <ThemeProvider theme={theme}>
        {isGame && (
          <Tabs value={value}>
            {/* <Tab
              label="싱글"
              value="single"
              component={Link}
              to="/game/single"
              sx={{ marginLeft: "10%" }}
            /> */}
            <Tab
              label="협동"
              value="cooperation"
              component={Link}
              to="/game/cooperation"
              sx={{ marginLeft: "10%" }}
            />
            <Tab label="배틀" value="battle" component={Link} to="/game/battle" />
          </Tabs>
        )}
      </ThemeProvider>
    </Container>
  );
}

const Container = styled(Box)`
  width: 350px;
  height: 100%;
  margin-top: auto;
  margin-right: auto;
  z-index: 100;

  & .Mui-selected {
    color: #fff;
    font-weight: bold;
  }
`;
