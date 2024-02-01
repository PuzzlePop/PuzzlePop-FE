import SockJS from "sockjs-client";
import StompJS from "stompjs";

const SOCKET_END_POINT = "http://localhost:8080/game";

const createSocket = () => {
  let sock;
  let stomp;
  const subscriptions = new Set();

  const onError = () => {
    console.log("socket error...");
  };

  const connect = (onConnectCallback) => {
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

  const subscribe = (detination, onMessageReceiverCallback) => {
    if (!stomp) {
      return;
    }
    const subscription = stomp.subscribe(detination, onMessageReceiverCallback);
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
