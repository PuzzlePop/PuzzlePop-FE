import { useNavigate, useParams } from "react-router-dom";
import PlayPuzzle from "../../components/PlayPuzzle";
import { useEffect, useState } from "react";
import { getRoomId, getSender } from "../../socket-utils/storage";
import { socket } from "../../socket-utils/socket";

const { connect, send, subscribe, disconnect } = socket;

export default function CooperationGameIngamePage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [gameData, setGameData] = useState(null);

  const connectSocket = async () => {
    // websocket 연결 시도
    connect(() => {
      // console.log("WebSocket 연결 성공");

      subscribe(`/topic/game/room/${roomId}`, (message) => {
        const { admin, gameId, gameName, picture, redTeam, roomSize, started, ...fetchedGameData } =
          JSON.parse(message.body);
        // 1. 게임이 끝나면 대기실 화면으로 보낸다.
        if (started === false) {
          window.location.href = `/game/cooperation/waiting/${gameId}`;
          return;
        }

        setGameData(fetchedGameData);
      });

      // 서버로 메시지 전송
      send(
        "/app/game/message",
        {},
        JSON.stringify({
          type: "ENTER",
          roomId: getRoomId(),
          sender: getSender(),
        }),
      );
    });
  };

  useEffect(() => {
    if (roomId !== getRoomId() || !getSender()) {
      navigate("/game/cooperation", {
        replace: true,
      });
      return;
    }

    connectSocket();
    setLoading(false);

    return () => {
      disconnect();
      // console.log("WebSocket 연결 종료");
    };

    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <h1>게임 정보를 받아오는 중...</h1>;
  }

  console.log(gameData);

  return (
    <>
      <h1>CooperationGameIngamePage : {roomId}</h1>
      <PlayPuzzle shapes={null} />
    </>
  );
}
