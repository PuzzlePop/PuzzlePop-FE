import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GamePageNavigation from "../../components/GamePageNavigation";
import Header from "../../components/Header";
import { request } from "../../apis/requestBuilder";

export default function CooperationGameListPage() {
  const navigate = useNavigate();
  const userId = 1;
  const [roomList, setRoomList] = useState([]);
  const [roomTitle, setRoomTitle] = useState("");
  const [roomSize, setRoomSize] = useState(8);

  const enterRoom = async (roomId) => {
    const sender = window.prompt("닉네임을 입력해주세요");
    if (sender) {
      localStorage.setItem("wschat.sender", sender);
      localStorage.setItem("wschat.roomId", roomId);
      navigate(`/game/cooperation/${roomId}`);
    }
  };

  const createRoom = async () => {
    const res = await request.post("/game/room", { name: roomTitle, userid: userId, type: "TEAM", roomSize: roomSize});
    const { gameId, gameName, gameType, admin, redTeam, blueTeam, isStarted } = res;
    console.log(res);
    setRoomTitle("");
    await findAllRoom();
  };

  const findAllRoom = async () => {
    const res = await request.get("/game/rooms");
    const { data } = res;
    setRoomList(data);
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
      <input
        placeholder="방 인원"
        value={roomSize}
        onChange={(e) => setRoomSize(e.target.value)}
      />
      <button onClick={createRoom}>방 만들기</button>
      <ul>
        {roomList.map((room, index) => (
          <div key={index} onClick={() => enterRoom(room.gameId)}>
            {room.gameName}
          </div>
        ))}
      </ul>
    </>
  );
}
