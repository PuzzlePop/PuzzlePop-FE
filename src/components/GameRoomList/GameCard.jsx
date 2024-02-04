import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Divider,
  Chip,
  CardActionArea,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { setRoomId, setSender } from "@/socket-utils/storage";

export default function GameCard({ room, category }) {
  const navigate = useNavigate();

  const {
    admin,
    blueTeam,
    gameId,
    gameName,
    gameType,
    isStarted,
    picture,
    redTeam,
    roomSize,
    sessionToUser,
    startTime,
  } = room;

  const chipMessage = `${parseInt(roomSize / 2)} : ${parseInt(roomSize / 2)}`;
  const chipColorArray = ["error", "warning", "success", "info"];
  const chipColor = chipColorArray[parseInt(roomSize / 2) - 1];

  const enterRoom = async (roomId) => {
    const sender = window.prompt("닉네임을 입력해주세요");
    if (!sender) {
      return;
    }
    setSender(sender);
    setRoomId(roomId);
    navigate(`/game/${category}/waiting/${roomId}`);
  };

  const handleClick = (event) => {
    enterRoom(event.currentTarget.id);
  };

  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
  });

  return (
    <MyCard onClick={handleClick} id={gameId}>
      <ThemeProvider theme={theme}>
        <MyCardActionArea>
          <CardMedia
            component="img"
            sx={{ width: 151, height: 151 }}
            image={picture.encodedString}
            alt={picture.encodedString}
          />
          <CardContent sx={{ display: "flex", flexDirection: "column", marginRight: "3%" }}>
            {category === "battle" && <MyChip label={chipMessage} color={chipColor} />}
            <Box sx={{ width: "250px", paddingY: "15%" }}>
              <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <Typography component="div" variant="h5">
                  {gameName}
                </Typography>
                <Typography sx={{ alignSelf: "end" }} component="div" variant="subtitle2">
                  {picture.lengthPieceCnt * picture.widthPieceCnt}pcs
                </Typography>
              </Box>

              <Divider sx={{ marginY: "3%" }} />

              <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <RoomState component="div" variant="h5">
                  {isStarted ? "Playing" : "Waiting"}
                </RoomState>
                <Typography variant="h6" color="text.secondary" component="div">
                  {redTeam.players.length + blueTeam.players.length} / {roomSize}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </MyCardActionArea>
      </ThemeProvider>
    </MyCard>
  );
}

const MyCard = styled(Card)`
  width: 460px;
  height: 150px;
  display: flex;
  position: relative;
  background-color: rgba(255, 255, 255, 0.7);
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
