import styled from "styled-components";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { PlayerCard, EmptyPlayerCard } from "@/components/GameWaiting/PlayerCard";

export default function GameWaitingBoard(props) {
  const { data, allowedPiece, category } = props;

  return (
    <Wrapper container spacing={4}>
      <ColGrid xs={8}>
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

        {/* battle 일땐 red team, blue team 나뉘어야 함 */}
        <InnerBox>
          <Grid container spacing={2}>
            {data.player.map((player) => (
              <Grid key={player.nickname} xs={3}>
                <PlayerCard player={player} />
              </Grid>
            ))}
            <Grid xs={3}>
              <EmptyPlayerCard />
            </Grid>
          </Grid>
        </InnerBox>
      </ColGrid>
      <ColGrid xs={4}>
        <InnerBox>hi</InnerBox>
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
