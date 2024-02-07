import { useState } from "react";
import styled from "styled-components";
import { Box, AppBar, Button, Typography, Drawer, createTheme, ThemeProvider } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import FriendList from "@/components/User/FriendList"

export default function Footer() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (event) => {
    setOpen(!open);
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
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <FooterBar>
        <Button onClick={toggleDrawer} sx={{ width: "100px", marginLeft: "auto" }}>
          친구 목록
        </Button>

        <Drawer anchor="right" open={open} onClose={toggleDrawer}>
          <Box sx={{ margin: "40px" }}>
            <DrawerTitle variant="h5">친구 목록</DrawerTitle>
            <FriendList></FriendList>
          </Box>
        </Drawer>
      </FooterBar>
    </ThemeProvider>
  );
}

function friendList() {}

function frinendCard() {}

const FooterBar = styled(AppBar)`
  position: fixed;
  top: auto;
  bottom: 0;
  background-color: #fff;
  border-top: 1px solid ${deepPurple[100]};
  padding: 3px 10px;
`;

const DrawerTitle = styled(Typography)`
  font-size: 30px;
  font-weight: bold;
  color: ${deepPurple[300]};
`;
