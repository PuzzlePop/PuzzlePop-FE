import styled from "styled-components";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { red, blue } from "@mui/material/colors";

function PlayerCard(props) {
  let { player, color } = props;
  // 필드 없는 값 임시로 채움
  player = {
    nickname: player.id,
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    isCaptain: true,
    isReady: true,
    isRedTeam: true,
  };
  const state = player.isCaptain ? "방 장" : player.isReady ? "준 비 완 료" : "준 비 중";

  return (
    <WrapperCard className={color}>
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
      <CardContent sx={{ margin: "auto" }}></CardContent>
    </WrapperCard>
  );
}

function XPlayerCard() {
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

  background-color: ${(props) => {
    if (props.className === "red") {
      return red[100];
    } else if (props.className === "blue") {
      return blue[100];
    }
  }};
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
      return "#aaa";
    }
  }};
  font-weight: ${(props) => {
    if (props.children === "방 장") {
      return "800";
    }
  }};
`;

export { PlayerCard, EmptyPlayerCard, XPlayerCard };
