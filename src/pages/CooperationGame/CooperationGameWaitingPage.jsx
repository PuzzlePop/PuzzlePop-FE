import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GamePageNavigation from "@/components/GamePageNavigation";
import { getSender, getRoomId } from "../../socket-utils/storage";
import { socket } from "../../socket-utils/socket";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

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
        const { admin, gameId, gameName, picture, redTeam, roomSize, started, ...fetchedGameData } =
          JSON.parse(message.body);
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
    setLoading(false);

    return () => {
      disconnect();
      // console.log("WebSocket 연결 종료");
    };

    // eslint-disable-next-line
  }, []);

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

  if (loading) {
    return <h1>대기실에 입장 중...</h1>;
  }

  console.log(gameData);

  return (
    <>
      <Header />
      {/* <GamePageNavigation /> */}
      <SocketMessageTestComponent />
      <h1>CooperationGameWaitingPage</h1>
      <div>roomId : {roomId}</div>
      <div>
        <button onClick={handleGameStart}>GAME START</button>
      </div>
      {/* <GameWaitingBoard data={dummyData} allowedPiece={allowedPiece} category="cooperation" />{" "} */}
      <Footer />
    </>
  );
}

// 더미 데이터
const dummyData = {
  roomId: 1,
  img: "https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/cnoC/image/R7FVHsxQscWuMqj6TtNhHLSH8do",
  title: "방 제목입니다.",
  isPlaying: false,
  totalPieceCount: 300,
  curPlayerCount: 4,
  maxPlayerCount: 6,
  player: [
    {
      nickname: "용상윤",
      img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      isCaptain: true,
      isReady: true,
      isRedTeam: true,
    },
    {
      nickname: "김다인",
      img: "https://ynoblesse.com/wp-content/uploads/2023/07/358520758_1425769678257003_8801872512201663407_n.jpg",
      isCaptain: false,
      isReady: false,
      isRedTeam: true,
    },
    {
      nickname: "김한중",
      img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      isCaptain: false,
      isReady: false,
      isRedTeam: false,
    },
    {
      nickname: "나해란",
      img: "https://mblogthumb-phinf.pstatic.net/MjAxODEwMjdfMjU0/MDAxNTQwNjQyMDcyMTA2.SLn2XYr5LVkefNG7EPLp56ce2WOnuy3UCCusjOyk-RUg.bs6Ir-_Dc1vfZTriBlJInV4St1UT-r2ssP0rfX3g_bYg.JPEG.dltnwjd49/444.jpg?type=w800",
      isCaptain: false,
      isReady: true,
      isRedTeam: false,
    },
  ],
};
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
