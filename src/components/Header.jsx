import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ImageIcon from "./ImageIcon";
import HeaderPuzzleImage from "@/assets/icons/header_puzzle.png";
import HeaderRankImage from "@/assets/icons/header_rank.png";
import HeaderShopImage from "@/assets/icons/header_shop.png";
import Logo from "@/assets/logo.png";
import { AppBar, Toolbar, Button, createTheme, ThemeProvider } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import GamePageNavigation from "@/components/GamePageNavigation";

export default function Header() {
  const navigate = useNavigate();

  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            color: deepPurple[700],
            fontSize: "20px",
          },
        },
      },
    },
  });

  return (
    <HeaderBar>
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <ImageIcon imageSource={Logo} size="lg" onClick={() => navigate("/")} />
        <GamePageNavigation />

        <nav style={{ display: "flex", gap: "20px" }}>
          <ImageIcon imageSource={HeaderPuzzleImage} size="md" onClick={() => navigate("/game")} />
          <ImageIcon imageSource={HeaderRankImage} size="md" onClick={() => navigate("/rank")} />
          <ImageIcon imageSource={HeaderShopImage} size="md" onClick={() => navigate("/shop")} />
          <ThemeProvider theme={theme}>
            <Button href="#" variant="text" sx={{ px: 2.5 }} size="large">
              Login
            </Button>
          </ThemeProvider>
        </nav>
      </Toolbar>
    </HeaderBar>
  );
}

const HeaderBar = styled(AppBar)`
  position: static;
  background-color: #c4b6fb;
`;

{
  /* <ImageIcon imageSource={headerPuzzleImage} size="lg" onClick={() => navigate("/game")} />
<ImageIcon imageSource={headerRankImage} size="lg" onClick={() => navigate("/rank")} />
<ImageIcon imageSource={headerShopImage} size="lg" onClick={() => navigate("/shop")} /> */
}
