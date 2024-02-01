import styled from "styled-components";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { PlayerCard, EmptyPlayerCard, XPlayerCard } from "@/components/GameWaiting/PlayerCard";
import SelectImgAndPiece from "@/components/GameWaiting/SelectImgAndPiece";

export default function GameWaitingBoard({ data, allowedPiece, category }) {
  const redTeams = data.player.filter((player) => player.isRedTeam);
  const blueTeams = data.player.filter((player) => !player.isRedTeam);

  // 배틀의 경우 [red팀 빈칸 수, blue팀 빈칸 수]
  // 협동의 경우 방 빈칸 수
  let emptyPlayerCount = 0;
  if (category === "battle") {
    emptyPlayerCount = [0, 0];
    emptyPlayerCount[0] = parseInt(data.maxPlayerCount / 2) - redTeams.length;
    emptyPlayerCount[1] = parseInt(data.maxPlayerCount / 2) - blueTeams.length;
  } else if (category === "cooperation") {
    emptyPlayerCount = data.maxPlayerCount - data.curPlayerCount;
  }

  let xPlayerCount = 0;
  if (category === "battle") {
    xPlayerCount = 4 - parseInt(data.maxPlayerCount / 2);
  } else if (category === "cooperation") {
    xPlayerCount = 8 - data.maxPlayerCount;
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

  return (
    <Wrapper container spacing={4}>
      <ColGrid xs={8}>
        {/* 방 번호, 방 제목, 인원수 header */}
        <InnerBox sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography component="div" variant="subtitle2">
            {data.roomId}번방
          </Typography>
          <Typography component="div" variant="h6">
            {data.title}
          </Typography>
          <Typography component="div" variant="subtitle1" sx={{ marginLeft: "auto" }}>
            {data.curPlayerCount} / {data.maxPlayerCount}
          </Typography>
        </InnerBox>

        {/* 대기실에 있는 player들 card */}
        <InnerBox>
          {category === "battle" ? (
            // 왜 여기서 unique key warning이 뜨는지 모르겠음...
            <Grid container spacing={2}>
              {redTeams.map((player) => (
                <Grid key={player.nickname} item xs={3}>
                  <PlayerCard player={player} color="red" />
                </Grid>
              ))}
              {makeEmptyPlayer(emptyPlayerCount[0])}
              {makeXPlayer()}
              {blueTeams.map((player) => (
                <Grid key={player.nickname} xs={3}>
                  <PlayerCard player={player} color="blue" />
                </Grid>
              ))}
              {makeEmptyPlayer(emptyPlayerCount[1])}
              {makeXPlayer()}
            </Grid>
          ) : (
            // 왜 여기서 unique key warning이 뜨는지 모르겠음...22
            <Grid container spacing={2}>
              {data.player.map((player) => {
                // console.log(player.nickname);
                return (
                  <Grid key={player.nickname} item xs={3}>
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
      <ColGrid xs={4}>
        <SelectImgAndPiece src={data.img} allowedPiece={allowedPiece} />
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
