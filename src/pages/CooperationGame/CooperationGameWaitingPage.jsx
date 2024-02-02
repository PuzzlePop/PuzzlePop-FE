import { useEffect, useState } from "react";
import GamePageNavigation from "@/components/GamePageNavigation";
import GameWaitingBoard from "@/components/GameWaiting/GameWaitingBoard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams } from "react-router-dom";
import { request } from "../../apis/requestBuilder";
import SockJS from "sockjs-client";
import StompJS from "stompjs";
import { getSender, getRoomId } from "../../socket-utils/storage";

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
import PlayPuzzle from "@/components/PlayPuzzle";
import ItemController from "../../components/ItemController";

export default function CooperationGameWaitingPage() {
  const { roomId } = useParams();
  const [roomInfo, setRoomInfo] = useState(null);
  const [sender, setSender] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState("");

  useEffect(() => {
    const storedSender = getSender();
    const storedRoomId = getRoomId();

    setSender(storedSender);
    let socket;
    let stomp;
    let subscription;

    // 방 정보 가져오기
    request
      .get(`/game/room/${storedRoomId}`)
      .then((res) => {
        console.log("Room info:", res.data);
        setRoomInfo(res.data);

        // WebSocket 연결
        socket = new SockJS(`http://localhost:8080/game`);
        stomp = StompJS.over(socket);

        // 연결 시도
        stomp.connect({}, () => {
          console.log("WebSocket 연결 성공");
          setStompClient(stomp);

          // 메시지 구독
          subscription = stomp.subscribe(`/topic/game/room/${storedRoomId}`, (message) => {
            const newMessage = JSON.parse(message.body);
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            // 서버에서 받은 game 객체를 콘솔에 출력
            if (newMessage.message === "combo") {
              console.log("Received game object:", newMessage);
            }
          });

          // 서버로 메시지 전송
          stomp.send(
            "/app/game/message",
            {},
            JSON.stringify({
              type: "ENTER",
              roomId: storedRoomId,
              sender: storedSender,
            }),
          );

          // 컴포넌트 언마운트 시 연결 종료
        });
      })
      .catch((error) => console.error("Error fetching room info:", error));
    return () => {
      subscription.unsubscribe();
      stomp.disconnect();
      console.log("WebSocket 연결 종료");
    };
    // eslint-disable-next-line
  }, []);

  const handleMessageSend = () => {
    if (stompClient && sender) {
      const message = {
        roomId: roomId.toString(),
        sender: sender.toString(),
        message: messages.toString(),
        type: "GAME",
      };
      stompClient.send(`/app/game/message`, {}, JSON.stringify(message));
    }
  };

  const handleInput = (e) => {
    setMessages(e.target.value);
  };

  return (
    <>
      <Header />
      {/* <GamePageNavigation /> */}
      <ItemController />
      <h1>CooperationGameWaitingPage</h1>
      <div>roomId : {roomId}</div>
      {/* <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              <strong>{message.sender}: </strong>
              {message.content}
            </li>
          ))}
        </ul>
      </div> */}
      <div>
        <input type="text" placeholder="Type your message" onChange={handleInput} />
        <button onClick={handleMessageSend}>Send</button>
      </div>
      {/* <GameWaitingBoard data={dummyData} allowedPiece={allowedPiece} category="cooperation" /> */}
      <PlayPuzzle />
      <Footer />
    </>
  );
}
