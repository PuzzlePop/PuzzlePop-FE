import SockJS from "sockjs-client";
import StompJS from "stompjs";

const { VITE_SERVER_END_POINT, VITE_DEV_SERVER_END_POINT } = import.meta.env;

const SERVER_END_POINT = import.meta.env.DEV ? VITE_DEV_SERVER_END_POINT : VITE_SERVER_END_POINT;

const SOCKET_END_POINT = `${SERVER_END_POINT}/game`;

const createSocket = () => {
  let sock;
  let stomp;

  const connect = (onConnectCallback, onError) => {
    sock = new SockJS(SOCKET_END_POINT);
    stomp = StompJS.over(sock);

    stomp.connect({}, onConnectCallback, onError);
  };

  const send = (destination, obj, message) => {
    if (!stomp) {
      return;
    }

    stomp.send(destination, obj, message);
  };

  const subscribe = (destination, onMessageReceiverCallback) => {
    if (!stomp) {
      return;
    }

    stomp.subscribe(destination, onMessageReceiverCallback);
  };

  // const disconnect = () => {
  //   if (!stomp) {
  //     return;
  //   }

  //   stomp.disconnect();
  // };

  return {
    connect,
    send,
    subscribe,
    // disconnect,
  };
};

export const socket = createSocket();
