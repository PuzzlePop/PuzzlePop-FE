import { useMemo } from "react";
import styled from "styled-components";

import { PlayerCard } from "@/components/GameWaiting/PlayerCard";
import { getTeam, getRoomId } from "@/socket-utils/storage";
import { useGameInfo } from "@/hooks/useGameInfo";

import winPath from "@/assets/effects/win.gif";
import youLostPath from "@/assets/effects/youLose.png";

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function ResultModal({
  isOpenedDialog,
  handleCloseGame,
  ourPercent,
  enemyPercent,
  ourTeam,
  enemyTeam,
  numOfUsingItemRed,
  numOfUsingItemBlue,
}) {
  const { image } = useGameInfo();

  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
  });

  const resultState = useMemo(() => {
    if (ourPercent > enemyPercent) {
      return "win";
    } else if (ourPercent === enemyPercent) {
      return "draw";
    } else {
      return "lose";
    }
  }, [ourPercent, enemyPercent]);

  const resultStateImgObject = {
    win: winPath,
    lose: youLostPath,
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={isOpenedDialog} onClose={handleCloseGame}>
        <ResultStateWrapper>
          {resultState === "draw" ? <h1>DRAW</h1> : <img src={resultStateImgObject[resultState]} />}
        </ResultStateWrapper>
        <DialogContent>
          <Wrapper>
            <ResultCard
              color={"red"}
              numOfUsingPositiveItem={numOfUsingItemRed.positiveItem.current}
              numOfUsingAttackItem={numOfUsingItemRed.attackItem.current}
              image={image}
              ourPercent={ourPercent}
              enemyPercent={enemyPercent}
            />
            <ResultCard
              color={"blue"}
              numOfUsingPositiveItem={numOfUsingItemBlue.positiveItem.current}
              numOfUsingAttackItem={numOfUsingItemBlue.attackItem.current}
              image={image}
              ourPercent={ourPercent}
              enemyPercent={enemyPercent}
            />
          </Wrapper>
          {/* <Grid container sx={{ width: "300px", height: "600px" }}>
            {ourTeam.map((player) => {
              <Grid item xs={3}>
                <PlayerCard player={player} color={getTeam()} gameId={getRoomId()} />
              </Grid>;
            })}
          </Grid>
          <Grid container>
            {enemyTeam.map((player) => {
              <Grid item xs={3}>
                <PlayerCard
                  player={player}
                  color={getTeam() === "red" ? "red" : "blue"}
                  gameId={getRoomId()}
                />
              </Grid>;
            })}
          </Grid> */}
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}

function ResultCard({
  color,
  numOfUsingPositiveItem,
  numOfUsingAttackItem,
  image,
  ourPercent,
  enemyPercent,
}) {
  const percent = getTeam() === color ? ourPercent : enemyPercent;

  return (
    <CardWrapper>
      <ImgWrapper>
        <White $percent={percent}></White>
        <CardImg src={image} />
        <PercentText $color={color}>{percent}%</PercentText>
      </ImgWrapper>

      <Card
        sx={{
          backgroundColor: color === "red" ? "lightpink" : "lightblue",
          margin: "2%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CardHeader $color={color}>{color} Team</CardHeader>
        <CardContent>
          <p>
            <NumSpan>{numOfUsingPositiveItem}번</NumSpan> 도움 아이템 (힌트, 자석, 액자)를
            사용했어요!
          </p>
          <p>
            <NumSpan>{numOfUsingAttackItem}번</NumSpan> 방해 아이템 (불 지르기, 로켓, 회오리)를
            사용했어요!
          </p>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}

const ResultStateWrapper = styled.div`
  margin: 5% auto 0 auto;

  & img {
    max-width: 250px;
  }

  -webkit-animation: bounce-in-bck 1.1s both;
  animation: bounce-in-bck 1.1s both;
`;

const Wrapper = styled.div`
  display: flex;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImgWrapper = styled.div`
  position: relative;
`;

const White = styled.div`
  position: absolute;
  width: 100%;
  height: ${(props) => {
    return `${100 - props.$percent}%`;
  }};
  background-color: rgba(255, 255, 255, 0.8);
`;

const CardImg = styled.img`
  height: 100px;
  border-radius: 5px;
`;

const PercentText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${(props) => {
    if (props.$color === "red") {
      return "red";
    } else {
      return "blue";
    }
  }};
  font-weight: bold;
  font-size: 30px;
  font-family: "Galmuri11", sans-serif;
`;

const CardHeader = styled.div`
  font-size: 22px;
  width: 90%;
  margin-top: 5%;
  border-bottom: 1px solid
    ${(props) => {
      if (props.$color === "red") {
        return "red";
      } else {
        return "blue";
      }
    }};
  color: ${(props) => {
    if (props.$color === "red") {
      return "red";
    } else {
      return "blue";
    }
  }};
`;

const NumSpan = styled.span`
  color: #fff;
  font-weight: bold;
  font-size: 20px;
  font-family: "Galmuri11", sans-serif;
`;
