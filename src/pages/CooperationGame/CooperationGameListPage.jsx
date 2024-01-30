import { useEffect, useState } from "react";
import axios from "axios";
import GamePageNavigation from "../../components/GamePageNavigation";
import GameRoomListBoard from "@/components/GameRoomList/GameRoomListBoard";

const request = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default function CooperationGameListPage() {
  const [roomList, setRoomList] = useState([]);

  return (
    <>
      <GamePageNavigation />
      <h1>CooperationGameListPage</h1>
      <SocketTestComponent />
      {roomList.map((room, index) => (
        <div key={index}>{room.name}</div>
      ))}
    </>
  );
}

const SocketTestComponent = () => {
  const [roomTitle, setRoomTitle] = useState("");
  const [userId, setUserId] = useState("");
  const [roomList, setRoomList] = useState([]);

  const createRoom = async () => {
    if (!roomTitle || !userId) {
      return;
    }

    // TODO: CORS 에러 해결하기
    const response = await request.post(`/game/room`, {
      name: roomTitle,
      userid: userId,
    });

    console.log(response);
  };

  const findAllRoom = async () => {
    axios.get("/game/rooms").then((response) => {
      if (response.status === 200 && response.data) {
        setRoomList(response.data);
      }
    });
  };

  useEffect(() => {
    findAllRoom();
  }, []);

  return (
    <>
      <div>
        <input
          placeholder="방 제목"
          value={roomTitle}
          onChange={(e) => {
            setRoomTitle(e.target.value);
          }}
        />
        <input
          type="number"
          placeholder="유저 아이디"
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
          }}
        />
        <button onClick={createRoom}>방 생성하기</button>
      </div>
      <GameRoomListBoard category="cooperation" />
    </>
  );
};
