import styled from "styled-components";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

function PlayerCard(props) {
  const { player } = props;
  const state = player.isCaptain ? "방 장" : player.isReady ? "준 비 완 료" : "준 비 중";

  return (
    <WrapperCard>
      <CardMedia
        sx={{ width: "110px", height: "110px" }}
        component="img"
        alt={player.nickname}
        image={player.img}
      />
      <Content>
        <Typography component="div" variant="subtitle1">
          {player.nickname}
        </Typography>
        <Divider sx={{ width: "100%" }} />
        <State component="div" variant="subtitle2">
          {state}
        </State>
      </Content>
    </WrapperCard>
  );
}

function EmptyPlayerCard() {
  return (
    <WrapperCard sx={{ height: "85%" }}>
      <CardContent sx={{ margin: "auto" }}>
        <Typography sx={{ color: "#ccc" }} component="div" variant="h1">
          X
        </Typography>
      </CardContent>
    </WrapperCard>
  );
}

const WrapperCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10% 0;
  border-radius: 15px;

  & img {
    border-radius: 10px;
  }
`;

const Content = styled(CardContent)`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;

  &:last-child {
    padding: 0;
  }
`;

const State = styled(Typography)`
  margin-top: 5px;
  color: ${(props) => {
    if (props.children === "방 장") {
      return "#3f51b5";
    } else if (props.children === "준 비 완 료") {
      return "#333";
    } else {
      return "#ddd";
    }
  }};
  font-weight: ${(props) => {
    if (props.children === "방 장") {
      return "bold";
    }
  }};
`;

export { PlayerCard, EmptyPlayerCard };
