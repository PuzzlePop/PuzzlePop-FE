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
import backgroundPath from "@/assets/background.gif";

export default function CooperationGameListPage() {
  const [roomList, setRoomList] = useState([]);

  const refetchAllRoom = () => {
    fetchAllRoom();
  };

  const fetchAllRoom = async () => {
    const res = await request.get("/game/rooms/cooperation", { id: getSender() });
    const { data: fetchedRoomList } = res;
    console.log(fetchedRoomList)
    setRoomList(fetchedRoomList);
  };

  useEffect(() => {
    fetchAllRoom();
  }, []);

  return (
    <Wrapper>
      <Header />

      <div
        style={{ display: "flex", alignItems: "center", width: "950px", margin: "5% auto 0 auto" }}
      >
        <h1>협동 플레이</h1>
        <IconButton aria-label="refresh" onClick={refetchAllRoom} sx={{ marginRight: "auto" }}>
          <RefreshIcon />
        </IconButton>
        <CreateRoomButton category="cooperation" />
      </div>

      <GameRoomListBoard category="cooperation" roomList={roomList} />

      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 1000px;
  background-image: url(${backgroundPath});
`;
