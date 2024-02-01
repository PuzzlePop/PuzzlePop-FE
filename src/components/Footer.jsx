import { useState } from "react";
import styled from "styled-components";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";

export default function Footer() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (event) => {
    setOpen(!open);
  };

  return (
    <FooterBar>
      <Button onClick={toggleDrawer} sx={{ width: "100px", marginLeft: "auto" }}>
        친구 목록
      </Button>
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Typography variant="h5">친구 목록</Typography>
      </Drawer>
    </FooterBar>
  );
}

function friendList() {}

const FooterBar = styled(AppBar)`
  position: fixed;
  top: auto;
  bottom: 0;
  background-color: #ccc;
  padding: 3px 10px;
`;
