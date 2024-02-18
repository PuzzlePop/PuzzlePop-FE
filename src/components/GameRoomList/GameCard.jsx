import { useState, useEffect } from "react";
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
  Snackbar,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";
import { setRoomId, setSender, setTeam } from "@/socket-utils/storage";
import { request } from "../../apis/requestBuilder";
import { isAxiosError } from "axios";

export default function GameCard({ room, category }) {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const {
    admin,
    blueTeam,
    gameId,
    gameName,
    gameType,
    started,
    picture,
    redTeam,
    roomSize,
    sessionToUser,
    startTime,
  } = room;

  const chipMessage = `${parseInt(roomSize / 2)} : ${parseInt(roomSize / 2)}`;

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }

  const enterRoom = async (roomId) => {
    let sender = getCookie("userId"); // 쿠키에서 userId 가져오기
    if (!sender) {
      sender = window.prompt("닉네임을 입력해주세요");
      if (!sender) {
        return;
      }
    }

    setSender(sender);
    setRoomId(roomId);
    setTeam("red");

    try {
      const res = await request.post(`/game/room/${roomId}`, { id: sender });
      console.log(res);
      navigate(`/game/${category}/waiting/${roomId}`);
    } catch (e) {
      if (isAxiosError(e) && e.response.status === 400) {
        // window.alert("다른 닉네임을 사용해주세요.");
        setSnackMessage(e.response.data);
        setSnackOpen(true);
      }
      if (isAxiosError(e) && e.response.status === 403) {
        setSnackMessage("정원이 가득찬 방입니다!");
        setSnackOpen(true);
      }
    }
  };

  const handleClick = (event, started) => {
    // if (started) {
    //   setSnackMessage("이미 게임이 시작된 방입니다!");
    //   setSnackOpen(true);
    // } else if (redTeam.players.length + blueTeam.players.length === roomSize) {
    //   setSnackMessage("정원이 가득찬 방입니다!");
    //   setSnackOpen(true);
    //   // alert("정원이 가득찬 방입니다! ㅠㅠ");
    // } else if (!started) {
    //   enterRoom(event.currentTarget.id);
    // }

    try {
      enterRoom(event.currentTarget.id);
    } catch (e) {
      setSnackOpen(e.response.data);
      setSnackOpen(true);
    }
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  const fetchImage = async () => {
    const imgRes = await request.get(`/image/${picture.id}`);
    setImgSrc(`data:image/jpeg;base64,${imgRes.data}`);
  };

  useEffect(() => {
    if (picture.encodedString === "짱구.jpg") {
      setImgSrc(
        "https://i.namu.wiki/i/1zQlFS0_ZoofiPI4-mcmXA8zXHEcgFiAbHcnjGr7RAEyjwMHvDbrbsc8ekjZ5iWMGyzJrGl96Fv5ZIgm6YR_nA.webp",
      );
    } else {
      fetchImage();
    }
  }, []);

  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
    palette: {
      purple1: {
        main: deepPurple[200],
        contrastText: "#fff",
      },
      purple2: {
        main: deepPurple[400],
        contrastText: "#fff",
      },
      purple3: {
        main: deepPurple[600],
        contrastText: "#fff",
      },
      purple4: {
        main: deepPurple[900],
        contrastText: "#fff",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <MyCard onClick={(e) => handleClick(e, started)} id={gameId} started={started.toString()}>
        <MyCardActionArea>
          <CardMedia
            component="img"
            sx={{ width: 151, height: 151 }}
            image={imgSrc}
            alt={picture.encodedString}
          />
          <CardContent sx={{ display: "flex", flexDirection: "column", marginRight: "3%" }}>
            {category === "battle" && (
              <MyChip label={chipMessage} color={`purple${parseInt(roomSize / 2)}`} />
            )}
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
                  {started ? "Playing" : "Waiting"}
                </RoomState>
                <Typography variant="h6" color="text.secondary" component="div">
                  {redTeam.players.length + blueTeam.players.length} / {roomSize}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </MyCardActionArea>
      </MyCard>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        message={snackMessage}
      />
    </ThemeProvider>
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
  opacity: ${(props) => {
    if (props.started === "true") {
      return 0.6;
    }
    return 1;
  }};
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
