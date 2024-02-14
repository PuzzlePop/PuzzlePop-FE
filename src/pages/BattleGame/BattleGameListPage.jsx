import { useEffect, useState } from "react";
import styled from "styled-components";
import { IconButton, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CreateRoomButton from "@/components/GameRoomList/CreateRoomButton";
import GameRoomListBoard from "@/components/GameRoomList/GameRoomListBoard";
import { request } from "@/apis/requestBuilder";
import { getSender } from "@/socket-utils/storage";
import backgroundPath from "@/assets/backgrounds/battleBackground.gif";
import { socket } from "../../socket-utils/socket2";

const { send, subscribe } = socket;

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

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }

  const quickMatching = () => {
    send(
      "/app/game/message",
      {},
      JSON.stringify({
        type: "QUICK",
        sender: getSender(),
        member: getCookie("userId") ? true : false,
      }),
    );

    //게임 결과
    subscribe(`/topic/game/room/quick/${getSender()}`, (message) => {
      const data = JSON.parse(message.body);
      if (data === "WAITING") {
        alert("waiting");
      } else {
        console.log(data);
      }
    });
  };
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
        <Button onClick={quickMatching}>빠른 1 VS 1 매칭</Button>
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
