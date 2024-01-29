import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function GamePageNavigation() {
  const url = useLocation().pathname;
  const [value, setValue] = useState(url);

  return (
    <Box sx={{ width: "100vw", borderBottom: 1, borderColor: "divider", marginBottom: "50px" }}>
      <Tabs value={value}>
        <Tab label="싱글" value="/game/single" component={Link} to="/game/single" />
        <Tab label="협동" value="/game/cooperation" component={Link} to="/game/cooperation" />
        <Tab label="배틀" value="/game/battle" component={Link} to="/game/battle" />
      </Tabs>
    </Box>
  );
}
