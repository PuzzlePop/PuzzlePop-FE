import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { request } from "../../apis/requestBuilder";
import SockJS from "sockjs-client";
import StompJS from "stompjs";

export default function CooperationGameWaitingPage() {
  const { roomId } = useParams();
  const [roomInfo, setRoomInfo] = useState(null);
  const [sender, setSender] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState('');

  const findRoom = async () => {
    request.get(`/game/room/${roomId}`).then((res) => setRoomInfo(res.data));
  };

  useEffect(() => {
    const storedSender = localStorage.getItem("wschat.sender");
    const storedRoomId = localStorage.getItem("wschat.roomId");

    setSender(storedSender);
    findRoom();

    const socket = new SockJS(`http://localhost:8080/game`);

    const stomp = StompJS.over(socket);

    // 연결 시도
    stomp.connect({}, () => {
      console.log("WebSocket 연결 성공");
      setStompClient(stomp);

      stomp.subscribe(`/topic/game/room/${roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // 서버에서 받은 game 객체를 콘솔에 출력
        console.log("Received game object:", newMessage);
      });

      // 서버로 메시지 전송
      stomp.send("/app/game/message", {}, JSON.stringify({
        type: 'ENTER',
        roomId: roomId,
        sender: storedSender
      }));
    });

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      if (stomp.connected) {
        stomp.disconnect();
        console.log("WebSocket 연결 종료");
      }
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
  }


  return (
    <>
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
        <input type="text" placeholder="Type your message" onChange={handleInput}/>
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </>
  );
}
