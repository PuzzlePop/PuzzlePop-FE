import React, { useState } from "react";
import styled from "styled-components";
import { Box, AppBar, Button, Typography, Drawer } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ChecklistIcon from '@mui/icons-material/Checklist';
import FriendList from "@/components/User/FriendList";
import FriendRequests from "@/components/User/FriendRequests";
import FriendSearch from "@/components/User/FriendSearch";

export default function Footer() {
  const [friendListOpen, setFriendListOpen] = useState(false);
  const [friendRequestsOpen, setFriendRequestsOpen] = useState(false);
  const [friendSearchOpen, setFriendSearchOpen] = useState(false);

  const toggleFriendList = () => {
    setFriendListOpen(!friendListOpen);
    setFriendRequestsOpen(false);
    setFriendSearchOpen(false);
  };

  const toggleFriendRequests = () => {
    setFriendListOpen(false);
    setFriendRequestsOpen(!friendRequestsOpen);
    setFriendSearchOpen(false);
  };

  const toggleFriendSearch = () => {
    setFriendListOpen(false);
    setFriendRequestsOpen(false);
    setFriendSearchOpen(!friendSearchOpen);
  };

  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            color: deepPurple[400],
            "&:hover": {
              backgroundColor: deepPurple[100],
              color: deepPurple[700],
            },
            width: "120px", // 버튼의 폭을 일정하게 설정
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <FooterBar>
        <ButtonGroup>
          <Button onClick={toggleFriendList}>
            <PeopleAltIcon/>
            친구 목록
          </Button>
          <Button onClick={toggleFriendRequests}>
            <ChecklistIcon/>
            받은 요청
          </Button>
          <Button onClick={toggleFriendSearch}>
            <PersonAddIcon/>
            유저 검색
          </Button>
        </ButtonGroup>

        <Drawer anchor="right" open={friendListOpen} onClose={toggleFriendList}>
          <Box sx={{ margin: "40px" }}>
            <DrawerTitle variant="h5">친구 목록</DrawerTitle>
            <FriendList></FriendList>
          </Box>
        </Drawer>

        <Drawer anchor="right" open={friendRequestsOpen} onClose={toggleFriendRequests}>
          <Box sx={{ margin: "40px" }}>
            <DrawerTitle variant="h5">받은 요청</DrawerTitle>
            <FriendRequests></FriendRequests>
          </Box>
        </Drawer>

        <Drawer anchor="right" open={friendSearchOpen} onClose={toggleFriendSearch}>
          <Box sx={{ margin: "40px" }}>
            <DrawerTitle variant="h5">유저 검색</DrawerTitle>
            <FriendSearch></FriendSearch>
          </Box>
        </Drawer>
      </FooterBar>
    </ThemeProvider>
  );
}

// FriendRequests, FriendSearch 컴포넌트 및 관련 스타일 컴포넌트는 추가로 작성해야 합니다.

const FooterBar = styled(AppBar)`
  position: fixed;
  top: auto;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.5);
  border-top: 1px solid ${deepPurple[100]};
  padding: 3px 10px;
  display: flex;
  justify-content: flex-end; // 오른쪽 정렬
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-left: auto; // 오른쪽으로 정렬
`;

const DrawerTitle = styled(Typography)`
  font-size: 30px;
  font-weight: bold;
  color: ${deepPurple[300]};
`;
