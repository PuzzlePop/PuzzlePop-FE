import SockJS from "sockjs-client";
import StompJS from "stompjs";

const { VITE_SERVER_END_POINT, VITE_DEV_SERVER_END_POINT } = import.meta.env;

const SERVER_END_POINT = import.meta.env.DEV ? VITE_DEV_SERVER_END_POINT : VITE_SERVER_END_POINT;

const SOCKET_END_POINT = `${SERVER_END_POINT}/game`;

const createSocket = () => {
  let sock;
  let stomp;
  const subscriptions = new Set();

  const connect = (onConnectCallback, onError) => {
    if (!sock) {
      sock = new SockJS(SOCKET_END_POINT);
    }

    if (!stomp) {
      stomp = StompJS.over(sock);
    }

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
    const subscription = stomp.subscribe(destination, onMessageReceiverCallback);
    subscriptions.add(subscription);
    return subscription;
  };

  const unsubscribe = (subscription) => {
    subscription.unsubscribe();
    subscriptions.delete(subscription);
  };

  const disconnect = () => {
    subscriptions.forEach((sub) => sub.unsubscribe());

    if (!stomp) {
      return;
    }

    stomp.disconnect();
  };

  return {
    connect,
    send,
    subscribe,
    unsubscribe,
    disconnect,
  };
};

export const socket = createSocket();
