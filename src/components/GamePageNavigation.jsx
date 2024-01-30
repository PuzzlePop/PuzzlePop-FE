import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function GamePageNavigation() {
  const url = useLocation().pathname.split("/")[2] || "single";
  const [value, setValue] = useState(url);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "50px",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Tabs value={value}>
        <Tab
          label="싱글"
          value="single"
          component={Link}
          to="/game/single"
          sx={{ marginLeft: "13%" }}
        />
        <Tab label="협동" value="cooperation" component={Link} to="/game/cooperation" />
        <Tab label="배틀" value="battle" component={Link} to="/game/battle" />
      </Tabs>
    </Box>
  );
}
