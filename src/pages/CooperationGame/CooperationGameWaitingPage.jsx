import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import GamePageNavigation from "@/components/GamePageNavigation";
import { getSender, getRoomId } from "@/socket-utils/storage";
import { socket } from "@/socket-utils/socket";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameWaitingBoard from "@/components/GameWaiting/GameWaitingBoard";
import Loading from "@/components/Loading";
import { request } from "../../apis/requestBuilder";
import { isAxiosError } from "axios";

const { connect, send, subscribe } = socket;

export default function CooperationGameWaitingPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [gameData, setGameData] = useState(null);
  const [chatHistory, setChatHistory] = useState([]); // 채팅 기록을 저장하는 상태 추가

  const connectSocket = async () => {
    // websocket 연결 시도
    connect(() => {
      console.log("@@@@@@@@@@@@@@@@ 대기실 소켓 연결 @@@@@@@@@@@@@@@@@@");

      subscribe(`/topic/game/room/${roomId}`, (message) => {
        const data = JSON.parse(message.body);

        // 1. 게임이 시작되면 인게임 화면으로 보낸다.
        if (data.gameId && data.started && data.started === true) {
          window.location.href = `/game/cooperation/ingame/${data.gameId}`;
          return;
        }
        setGameData(data);
      });

      subscribe(`/topic/chat/room/${roomId}`, (message) => {
        const data = JSON.parse(message.body);
        const { userid, chatMessage, time } = data;
        const receivedMessage = { userid, chatMessage, time }; // 받은 채팅
        setChatHistory((prevChat) => [...prevChat, receivedMessage]); // 채팅 기록에 새로운 채팅 추가
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

  const initialize = async () => {
    try {
      await request.post(`/game/room/${roomId}`, { id: getSender() });
      await connectSocket();
    } catch (e) {
      if (isAxiosError(e) && e.response.status >= 400) {
        navigate("/game/cooperation", {
          replace: true,
        });
      }
    }
  };

  useEffect(() => {
    if (roomId !== getRoomId() || !getSender()) {
      navigate("/game/cooperation", {
        replace: true,
      });
      return;
    }

    initialize();

    return () => {
      // disconnect();
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
        <Loading message="방 정보 불러오는 중..." />
      ) : (
        <>
          <ChattingTest chatHistory={chatHistory} />
          <div>
            <button onClick={handleGameStart}>GAME START</button>
          </div>
          {/* 필요한 정보 : 각 플레이어의 상태 (방장, 준비완료, 준비x) */}
          <GameWaitingBoard
            player={getSender()}
            data={gameData}
            allowedPiece={allowedPiece}
            category="cooperation"
          />
        </>
      )}
      <Footer />
    </>
  );
}

const allowedPiece = [100, 200, 300, 400, 500];

const ChattingTest = ({ chatHistory }) => {
  const [message, setMessage] = useState("");

  const handleMessageSend = (e) => {
    e.preventDefault();
    if (getSender()) {
      send(
        `/app/game/message`,
        {},
        JSON.stringify({
          roomId: getRoomId(),
          sender: getSender(),
          message,
          type: "CHAT",
        }),
      );
      setMessage("");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        {/* 채팅 기록을 화면에 출력 */}
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <strong>
              {chat.userid}[{chat.time}]:{" "}
            </strong>
            {chat.chatMessage}
          </div>
        ))}
      </div>

      <form onSubmit={handleMessageSend}>
        <input
          type="text"
          placeholder="채팅"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};
