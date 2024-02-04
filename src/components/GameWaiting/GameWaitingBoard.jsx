import styled from "styled-components";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, blue } from "@mui/material/colors";
import { PlayerCard, EmptyPlayerCard, XPlayerCard } from "@/components/GameWaiting/PlayerCard";
import SelectImgAndPiece from "@/components/GameWaiting/SelectImgAndPiece";

export default function GameWaitingBoard({ data, allowedPiece, category }) {
  // const redTeam = data.player.filter((player) => player.isRedTeam);
  // const blueTeam = data.player.filter((player) => !player.isRedTeam);
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
        <Grid xs={3}>
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
        <Grid xs={3}>
          <XPlayerCard></XPlayerCard>
        </Grid>,
      );
    }

    return result;
  };

  const theme = createTheme({
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
    },
  });

  return (
    <Wrapper container="true" spacing={4}>
      <ColGrid item="true" xs={8}>
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
            <Grid container="true" spacing={2}>
              {redTeam.players.map((player) => (
                <Grid key={player.id} item="true" xs={3}>
                  <PlayerCard player={player} color="red" />
                </Grid>
              ))}
              {makeEmptyPlayer(emptyPlayerCount[0])}
              {makeXPlayer()}
              {blueTeam.players.map((player) => (
                <Grid key={player.id} item="true" xs={3}>
                  <PlayerCard player={player} color="blue" />
                </Grid>
              ))}
              {makeEmptyPlayer(emptyPlayerCount[1])}
              {makeXPlayer()}
            </Grid>
          ) : (
            // 왜 여기서 unique key warning이 뜨는지 모르겠음...22
            <Grid container="true" spacing={2}>
              {redTeam.players.map((player) => {
                // console.log(player.nickname);
                return (
                  <Grid key={player.id} item="true" xs={3}>
                    <PlayerCard player={player} />
                  </Grid>
                );
              })}
              {makeEmptyPlayer(emptyPlayerCount)}
              {makeXPlayer()}
            </Grid>
          )}
        </InnerBox>
      </ColGrid>

      {/* 퍼즐 이미지 선택, 피스 수 선택 */}
      <ColGrid item="true" xs={4}>
        <SelectImgAndPiece src={picture.encodedString} allowedPiece={allowedPiece} />

        {category === "battle" && (
          <InnerBox>
            <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
              팀 선택
            </Typography>
            <ThemeProvider theme={theme}>
              <Box sx={{ display: "flex" }}>
                {/* 팀 선택 버튼들, 추후 socket 연결하여 플레이어의 팀 정보 수정해야 함 */}
                <TeamButton variant="contained" color="redTeam" disableElevation>
                  Red
                </TeamButton>
                <TeamButton variant="contained" color="blueTeam" disableElevation>
                  Blue
                </TeamButton>
              </Box>
            </ThemeProvider>
          </InnerBox>
        )}
      </ColGrid>
    </Wrapper>
  );
}

const Wrapper = styled(Grid)`
  width: 1100px;
  padding: 1% 2%;
  margin: 3% auto;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 20px;
`;

const ColGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
`;

const InnerBox = styled(Box)`
  width: 95%;
  padding: 2% 3%;
  margin: 5px 0;
  background-color: #eee;
  border-radius: 10px;
`;

const TeamButton = styled(Button)`
  width: 50%;
  margin: 2% 3%;
`;
