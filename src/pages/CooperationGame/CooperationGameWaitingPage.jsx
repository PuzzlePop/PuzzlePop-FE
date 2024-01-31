import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { request } from "../../apis/requestBuilder";
import SockJS from "sockjs-client";
import StompJS from "stompjs";
import PlayPuzzle from "@/components/PlayPuzzle";
import ItemController from "../../components/ItemController";

export default function CooperationGameWaitingPage() {
  const { roomId } = useParams();
  const [roomInfo, setRoomInfo] = useState(null);
  const [sender, setSender] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState("");

  useEffect(() => {
    const storedSender = localStorage.getItem("wschat.sender");
    const storedRoomId = localStorage.getItem("wschat.roomId");

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
            if (newMessage.message === 'combo'){
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
      <PlayPuzzle />
    </>
  );
}
