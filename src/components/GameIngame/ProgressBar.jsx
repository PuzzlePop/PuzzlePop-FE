import styled from "styled-components";
import LinearProgress from "@mui/material/LinearProgress";

export default function PrograssBar({ percent, isEnemy }) {
  const barColor = isEnemy ? "#FF8888" : "#FFDB95";

  return (
    <BorderLinearProgress
      variant="determinate"
      value={percent}
      sx={{
        borderRadius: "8px",
        backgroundColor: "#385682",
        "& span.MuiLinearProgress-bar": {
          transform: `translateY(-${100 - percent}%) !important`,
          backgroundColor: barColor,
          borderRadius: "8px",
        },
      }}
    />
  );
}

const BorderLinearProgress = styled(LinearProgress)`
  width: 16px;
  height: 750px;
  border-radius: 8px;
`;
