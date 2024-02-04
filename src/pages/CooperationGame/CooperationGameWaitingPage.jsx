import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import GamePageNavigation from "@/components/GamePageNavigation";
import { getSender, getRoomId } from "@/socket-utils/storage";
import { socket } from "@/socket-utils/socket";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameWaitingBoard from "@/components/GameWaiting/GameWaitingBoard";
import Loading from "@/components/Loading";

const { connect, send, subscribe, disconnect } = socket;

export default function CooperationGameWaitingPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [gameData, setGameData] = useState(null);

  const connectSocket = async () => {
    // websocket 연결 시도
    connect(() => {
      // console.log("WebSocket 연결 성공");

      subscribe(`/topic/game/room/${roomId}`, (message) => {
        // const { admin, gameId, gameName, picture, redTeam, roomSize, started, ...fetchedGameData } =
        //   JSON.parse(message.body);
        const { ...fetchedGameData } = JSON.parse(message.body);
        const gameId = fetchedGameData.gameId;
        const started = fetchedGameData.started;
        // 1. 게임이 시작되면 인게임 화면으로 보낸다.
        if (started === true) {
          window.location.href = `/game/cooperation/ingame/${gameId}`;
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

    return () => {
      disconnect();
      // console.log("WebSocket 연결 종료");
    };

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (gameData) {
      setLoading(false);
    }
  }, [gameData]);

  const handleGameStart = () => {
    if (getSender()) {
      send(
        `/app/game/message`,
        {},
        JSON.stringify({
          roomId,
          sender: getSender(),
          message: "GAME_START",
          type: "GAME",
        }),
      );
    }
  };

  return (
    <>
      <Header />
      {loading ? (
        <Loading />
      ) : (
        <>
          <SocketMessageTestComponent />
          <h1>CooperationGameWaitingPage</h1>
          <div>roomId : {roomId}</div>
          <div>
            <button onClick={handleGameStart}>GAME START</button>
          </div>
          {/* 필요한 정보 : 각 플레이어의 상태 (방장, 준비완료, 준비x) */}
          <GameWaitingBoard data={gameData} allowedPiece={allowedPiece} category="cooperation" />
        </>
      )}
      <Footer />
    </>
  );
}

const allowedPiece = [100, 200, 300, 400, 500];

const SocketMessageTestComponent = () => {
  const [message, setMessage] = useState("");

  const handleMessageSend = () => {
    if (getSender()) {
      send(
        `/app/game/message`,
        {},
        JSON.stringify({
          roomId,
          sender: getSender(),
          message,
          type: "GAME",
        }),
      );
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Type your message(test 용)"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleMessageSend}>Send</button>
    </div>
  );
};
