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

  return (
    <>
      <h1>CooperationGameWaitingPage</h1>
      <div>roomId : {roomId}</div>
    </>
  );
}
