import GamePageNavigation from "../../components/GamePageNavigation";
import Header from "../../components/Header";
import { request } from "../../apis/requestBuilder";
import { useEffect, useState } from "react";

export default function CooperationGameListPage() {
  const userId = 1;
  const [roomList, setRoomList] = useState([]);
  const [roomTitle, setRoomTitle] = useState("");

  const createRoom = async () => {
    request.post("/game/room", { name: roomTitle, userid: userId }).then((res) => {
      const { gameId, gameName, gameType, admin, redTeam, blueTeam, isStarted } = res;
      setRoomTitle("");
      setRoomList((prev) => [...prev, { gameId, gameName }]);
    });
  };

  const findAllRoom = async () => {
    request.get("/game/rooms").then(({ data }) => setRoomList(data));
  };

  useEffect(() => {
    findAllRoom();
  }, []);

  return (
    <>
      <Header />
      <GamePageNavigation />
      <input
        placeholder="방 제목"
        value={roomTitle}
        onChange={(e) => setRoomTitle(e.target.value)}
      />
      <button onClick={createRoom}>방 만들기</button>
      <ul>
        {roomList.map((room) => (
          <div key={room.gameId}>{room.gameName}</div>
        ))}
      </ul>
    </>
  );
}
