import { useEffect, useState } from "react";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CreateRoomButton from "@/components/GameRoomList/CreateRoomButton";
import GameRoomListBoard from "@/components/GameRoomList/GameRoomListBoard";
import { request } from "@/apis/requestBuilder";
import { getSender } from "@/socket-utils/storage";
// import backgroundPath from "@/assets/background.gif";
import backgroundPath from "@/assets/battleBackground.gif";

export default function BattleGameListPage() {
  const [roomList, setRoomList] = useState([]);

  const refetchAllRoom = () => {
    fetchAllRoom();
  };

  const fetchAllRoom = async () => {
    const res = await request.get("/game/rooms/battle", { id: getSender() });
    const { data: fetchedRoomList } = res;
    console.log(fetchedRoomList);
    setRoomList(fetchedRoomList);
  };

  useEffect(() => {
    fetchAllRoom();
  }, []);

  return (
    <Wrapper>
      <Header />

      <div
        style={{ display: "flex", alignItems: "center", width: "950px", margin: "3% auto 0 auto" }}
      >
        <h1>배틀 플레이</h1>
        <IconButton aria-label="refresh" onClick={refetchAllRoom} sx={{ marginRight: "auto" }}>
          <RefreshIcon />
        </IconButton>
        <CreateRoomButton category="battle" />
      </div>

      <GameRoomListBoard category="battle" roomList={roomList} />

      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 900px;
  background-image: url(${backgroundPath});
`;
