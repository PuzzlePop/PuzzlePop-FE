import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ImageIcon from "./ImageIcon";
import HeaderPuzzleImage from "@/assets/icons/header_puzzle.png";
import HeaderRankImage from "@/assets/icons/header_rank.png";
import HeaderShopImage from "@/assets/icons/header_shop.png";
import Logo from "@/assets/logo.png";
import { AppBar, Toolbar, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";
import GamePageNavigation from "@/components/GamePageNavigation";
import { request } from "../apis/requestBuilder";

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

  // 기본값은 로그아웃 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getCookie("accessToken");

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        return cookie.substring(name.length + 1);
      }
    }
  };

  const moveLogin = async () => {
    // window.alert("아직 개발 중인 기능이에요 😂");
    const SERVER_URL = import.meta.env.VITE_SERVER_END_POINT;

    if (isLoggedIn) {
      // 로그인 상태이면 로그아웃 처리
      window.location.href = `${SERVER_URL}/logout`;
      // request.get(`${SERVER_URL}/logout`)
    } else {
      // 로그아웃 상태이면 로그인 처리
      window.location.href = `${SERVER_URL}/login`;
      // window.location.href = `${SERVER_URL}/oauth2/authorization/google`;
      // request.get(`${SERVER_URL}/login`)
    }
  };

  const moveProfile = async () => {
    const userId = getCookie("userId");
    if (!userId) {
      alert("잘못된 접근입니다.");
      navigate("/");
    } else {
      navigate(`/user/${userId}`);
    }
  };

  return (
    <HeaderBar>
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <ImageIcon imageSource={Logo} size="lg" onClick={() => navigate("/")} />
        <GamePageNavigation />

        <nav style={{ display: "flex", gap: "20px" }}>
          <ImageIcon imageSource={HeaderPuzzleImage} size="md" onClick={() => navigate("/game")} />
          <ImageIcon imageSource={HeaderRankImage} size="md" onClick={() => navigate("/rank")} />
          {/* <ImageIcon imageSource={HeaderShopImage} size="md" onClick={() => navigate("/shop")} /> */}
          <ThemeProvider theme={theme}>
            {getCookie("userId") && isLoggedIn && (
              <Button variant="text" size="large" onClick={moveProfile}>
                mypage
              </Button>
            )}
            <Button variant="text" size="large" onClick={moveLogin}>
              {isLoggedIn ? "Logout" : "Login"}
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
