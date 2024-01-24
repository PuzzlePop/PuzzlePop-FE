import { useState } from "react";
import GamePageNavigation from "../../components/GamePageNavigation";

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

  const handleCreateWaitingRoom = () => {
    if (!roomTitle || !userId) {
      return;
    }

    // TODO: 여기서 소켓 연결
    window.alert(
      JSON.stringify({
        roomTitle,
        userId: Number(userId),
      }),
    );
  };

  return (
    <>
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
      <button onClick={handleCreateWaitingRoom}>방 생성하기</button>
    </>
  );
};
