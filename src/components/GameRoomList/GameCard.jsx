import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import CardActionArea from "@mui/material/CardActionArea";

export default function GameCard({
  blueTeam,
  gameId,
  gameName,
  gameType,
  isStarted,
  redTeam,
  sessionToUser,
  startTime,
  ...room
}) {
  const navigate = useNavigate();
  // const { roomId, img, title, isPlaying, totalPieceCount, curPlayerCount, maxPlayerCount } =
  //   props.data;

  const chipMessage = `${parseInt(maxPlayerCount / 2)} : ${parseInt(maxPlayerCount / 2)}`;
  const chipColorArray = ["error", "warning", "success", "info"];
  const chipColor = chipColorArray[parseInt(maxPlayerCount / 2) - 1];

  const handleClick = (event) => {
    navigate(`/game/${props.category}/${event.currentTarget.id}`);
  };
  return (
    <MyCard onClick={handleClick} id={roomId}>
      <MyCardActionArea>
        <CardMedia component="img" sx={{ width: 151, height: 151 }} image={img} alt={title} />
        <CardContent sx={{ display: "flex", flexDirection: "column", marginRight: "3%" }}>
          {props.category === "battle" && <MyChip label={chipMessage} color={chipColor} />}
          <Box sx={{ width: "250px", paddingY: "15%" }}>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
              <Typography component="div" variant="h5">
                {title}
              </Typography>
              <Typography sx={{ alignSelf: "end" }} component="div" variant="subtitle2">
                {totalPieceCount}pcs
              </Typography>
            </Box>

            <Divider sx={{ marginY: "3%" }} />

            <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
              <RoomState component="div" variant="h5">
                {isPlaying ? "Playing" : "Waiting"}
              </RoomState>
              <Typography variant="h6" color="text.secondary" component="div">
                {curPlayerCount} / {maxPlayerCount}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </MyCardActionArea>
    </MyCard>
  );
}

const MyCard = styled(Card)`
  width: 460px;
  height: 150px;
  display: flex;
  position: relative;
  &:hover {
    box-shadow: 5px 5px 10px lightgray;
  }
`;

const MyCardActionArea = styled(CardActionArea)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  &:foucs {
    outline: none;
  }
`;

const MyChip = styled(Chip)`
  position: absolute;
  top: 3%;
  right: 5%;
  align-self: end;
`;

const RoomState = styled(Typography)`
  font-weight: bold;
  color: ${(props) => {
    if (props.children === "Playing") {
      return "#f44336";
    } else {
      return "#3f51b5";
    }
  }};
`;

const SAMPLE_IMAGE =
  "https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/cnoC/image/R7FVHsxQscWuMqj6TtNhHLSH8do";
