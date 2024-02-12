import { useState } from "react";
import styled from "styled-components";
import { Grid, Box, Typography, Button, Snackbar } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, blue, deepPurple } from "@mui/material/colors";
import { PlayerCard, EmptyPlayerCard, XPlayerCard } from "@/components/GameWaiting/PlayerCard";
import SelectImgAndPiece from "@/components/GameWaiting/SelectImgAndPiece";
import Chatting from "@/components/GameWaiting/Chatting";
import { getSender, getTeam, setTeam, setTeamSocket } from "@/socket-utils/storage";
import { socket } from "@/socket-utils/socket";

const { send } = socket;

export default function GameWaitingBoard({ player, data, allowedPiece, category, chatHistory }) {
  // const redTeam = data.player.filter((player) => player.isRedTeam);
  // const blueTeam = data.player.filter((player) => !player.isRedTeam);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const { redTeam, blueTeam, gameId, gameName, picture, roomSize } = data;

  // 배틀의 경우 [red팀 빈칸 수, blue팀 빈칸 수]
  // 협동의 경우 방 빈칸 수
  let emptyPlayerCount = 0;
  if (category === "battle") {
    emptyPlayerCount = [0, 0];
    emptyPlayerCount[0] = parseInt(roomSize / 2) - redTeam.players.length;
    emptyPlayerCount[1] = parseInt(roomSize / 2) - blueTeam.players.length;
  } else if (category === "cooperation") {
    emptyPlayerCount = roomSize - redTeam.players.length - blueTeam.players.length;
  }

  let xPlayerCount = 0;
  if (category === "battle") {
    xPlayerCount = 4 - parseInt(roomSize / 2);
  } else if (category === "cooperation") {
    xPlayerCount = 8 - roomSize;
  }

  const makeEmptyPlayer = (count) => {
    const result = [];

    for (let i = 0; i < count; i++) {
      result.push(
        <Grid item xs={3} sx={{ paddingRight: "8px" }}>
          <EmptyPlayerCard></EmptyPlayerCard>
        </Grid>,
      );
    }

    return result;
  };

  const makeXPlayer = () => {
    const result = [];

    for (let i = 0; i < xPlayerCount; i++) {
      result.push(
        <Grid item xs={3} sx={{ paddingRight: "8px" }}>
          <XPlayerCard></XPlayerCard>
        </Grid>,
      );
    }

    return result;
  };

  const handleGameStart = () => {
    if (getSender()) {
      send(
        `/app/game/message`,
        {},
        JSON.stringify({
          roomId: gameId,
          sender: getSender(),
          message: "GAME_START",
          type: "GAME",
        }),
      );
    }
  };

  const handleChangeTeam = (value) => {
    const targetTeamLength = value === "red" ? redTeam.players.length : blueTeam.players.length;

    if (getTeam() === value) {
      // alert(`이미 ${value}팀입니다!`);
      setSnackMessage(`이미 ${value}팀입니다!`);
      setSnackOpen(true);
    } else if (parseInt(roomSize / 2) === targetTeamLength) {
      // alert(`${value}팀의 정원이 가득찼습니다!`);
      setSnackMessage(`${value}팀의 정원이 가득찼습니다!`);
      setSnackOpen(true);
    } else {
      setTeam(value);
      setTeamSocket();
    }
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
    palette: {
      redTeam: {
        light: red[300],
        main: red[400],
        dark: red[500],
        darker: red[600],
        contrastText: "#fff",
      },
      blueTeam: {
        light: blue[300],
        main: blue[400],
        dark: blue[500],
        darker: blue[600],
        contrastText: "#fff",
      },
      purple: {
        light: deepPurple[200],
        main: deepPurple[300],
        dark: deepPurple[400],
        darker: deepPurple[600],
        contrastText: "#fff",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Wrapper container={true}>
        <ColGrid item={true} xs={8}>
          {/* 방 번호, 방 제목, 인원수 header */}
          <InnerBox sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* <Typography component="div" variant="subtitle2">
            {gameId}번방
          </Typography> */}
            <Typography component="div" variant="h6">
              {gameName}
            </Typography>
            <Typography component="div" variant="subtitle1" sx={{ marginLeft: "auto" }}>
              {redTeam.players.length + blueTeam.players.length} / {roomSize}
            </Typography>
          </InnerBox>

          {/* 대기실에 있는 player들 card */}
          <InnerBox>
            {category === "battle" ? (
              // 왜 여기서 unique key warning이 뜨는지 모르겠음...
              <Grid container={true} sx={{ marginTop: "2%" }}>
                {redTeam.players.map((player) => (
                  <Grid key={player.id} item={true} xs={3} sx={{ paddingRight: "8px" }}>
                    <PlayerCard player={player} gameId={gameId} color="red" />
                  </Grid>
                ))}
                {makeEmptyPlayer(emptyPlayerCount[0])}
                {makeXPlayer()}
                {blueTeam.players.map((player) => (
                  <Grid key={player.id} item={true} xs={3} sx={{ paddingRight: "8px" }}>
                    <PlayerCard player={player} gameId={gameId} color="blue" />
                  </Grid>
                ))}
                {makeEmptyPlayer(emptyPlayerCount[1])}
                {makeXPlayer()}
              </Grid>
            ) : (
              // 왜 여기서 unique key warning이 뜨는지 모르겠음...22
              <Grid container={true} sx={{ marginTop: "2%" }}>
                {redTeam.players.map((player) => {
                  return (
                    <Grid key={player.id} item={true} xs={3} sx={{ paddingRight: "8px" }}>
                      <PlayerCard player={player} gameId={gameId} />
                    </Grid>
                  );
                })}
                {makeEmptyPlayer(emptyPlayerCount)}
                {makeXPlayer()}
              </Grid>
            )}
          </InnerBox>

          {/* 텍스트 채팅 */}
          <InnerBox style={{ padding: "2%", paddingBottom: 0 }}>
            <Chatting chatHistory={chatHistory} />
          </InnerBox>
        </ColGrid>

        {/* 퍼즐 이미지 선택, 피스 수 선택 */}
        <ColGrid item={true} xs={4}>
          <SelectImgAndPiece src={picture.encodedString} allowedPiece={allowedPiece} />
          {category === "battle" && (
            <InnerBox>
              <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                팀 선택
              </Typography>

              <Box sx={{ display: "flex" }}>
                {/* 팀 선택 버튼들, 추후 socket 연결하여 플레이어의 팀 정보 수정해야 함 */}
                <TeamButton
                  variant="contained"
                  color="redTeam"
                  disableElevation
                  onClick={() => handleChangeTeam("red")}
                >
                  Red
                </TeamButton>
                <TeamButton
                  variant="contained"
                  color="blueTeam"
                  disableElevation
                  onClick={() => handleChangeTeam("blue")}
                >
                  Blue
                </TeamButton>
              </Box>
            </InnerBox>
          )}
          <StartButton variant="contained" size="large" color="purple" onClick={handleGameStart}>
            GAME START
          </StartButton>
        </ColGrid>
      </Wrapper>

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

const Wrapper = styled(Grid)`
  width: 900px;
  padding: 1% 2%;
  margin: 3% auto;
  background-color: rgba(255, 255, 255, 0.6);
  border: 1px solid #ccc;
  border-radius: 20px;
`;

const ColGrid = styled(Grid)`
  padding: 1.5%;
  display: flex;
  flex-direction: column;
`;

const InnerBox = styled(Box)`
  width: 95%;
  padding: 2% 3%;
  margin: 5px 0;
  background-color: rgba(231, 224, 255, 0.7);
  border: 1px solid #c4b6fb;
  border-radius: 10px;
`;

const TeamButton = styled(Button)`
  width: 50%;
  margin: 2% 3%;
`;

const StartButton = styled(Button)`
  padding: 5%;
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 5%;
  margin-top: auto;
`;
