import { useCallback, useEffect } from "react";
import SockJS from "sockjs-client";
import StompJS from "stompjs";
import { getRoomId, getSender } from "../socket-utils/storage";

let socket = new SockJS(`http://localhost:8080/game`);
let stomp = StompJS.over(socket);

export default function ItemController() {
  const storedSender = getSender();
  const storedRoomId = getRoomId();
  

  

  const handleClick1 = () => {
    console.log("1번키 누름");
    stomp.send('/app/game/message', {}, JSON.stringify({
      type: 'GAME',
      roomId: storedRoomId,
      sender: storedSender,
      message: "USE_ITEM",
      targets: 1
    }));
  };

  const handleClick2 = () => {
    console.log("2번키 누름");
    stomp.send('/app/game/message', {}, JSON.stringify({
      type: 'GAME',
      roomId: storedRoomId,
      sender: storedSender,
      message: "USE_ITEM",
      targets: 2
    }));
  };

  const handleClick3 = () => {
    console.log("3번키 누름");
    stomp.send('/app/game/message', {}, JSON.stringify({
      type: 'GAME',
      roomId: storedRoomId,
      sender: storedSender,
      message: "USE_ITEM",
      targets: 3
    }));
  };

  const handleClick4 = () => {
    console.log("4번키 누름");
    stomp.send('/app/game/message', {}, JSON.stringify({
      type: 'GAME',
      roomId: storedRoomId,
      sender: storedSender,
      message: "USE_ITEM",
      targets: 4
    }));
  };

  const handleClick5 = () => {
    console.log("5번키 누름");
    stomp.send('/app/game/message', {}, JSON.stringify({
      type: 'GAME',
      roomId: storedRoomId,
      sender: storedSender,
      message: "USE_ITEM",
      targets: 5
    }));
  };

  const handleOnKeydown = useCallback((e) => {
    if (e.code === "Digit1") {
      handleClick1();
      return;
    }

    if (e.code === "Digit2") {
      handleClick2();
      return;
    }

    if (e.code === "Digit3") {
      handleClick3();
      return;
    }

    if (e.code === "Digit4") {
      handleClick4();
      return;
    }

    if (e.code === "Digit5") {
      handleClick5();
      return;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleOnKeydown);

    return () => {
      window.removeEventListener("keydown", handleOnKeydown);
    };
  }, [handleOnKeydown]);

  return (
    <>
      <button onClick={handleClick1}>1</button>
      <button onClick={handleClick2}>2</button>
      <button onClick={handleClick3}>3</button>
      <button onClick={handleClick4}>4</button>
      <button onClick={handleClick5}>5</button>
    </>
  );
}
