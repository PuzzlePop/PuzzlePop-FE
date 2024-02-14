import * as SockJS from "sockjs-client";
import StompJs from "@stomp/stompjs";

const { VITE_SERVER_END_POINT, VITE_DEV_SERVER_END_POINT } = import.meta.env;
const SERVER_END_POINT = import.meta.env.DEV ? VITE_DEV_SERVER_END_POINT : VITE_SERVER_END_POINT;
const SOCKET_END_POINT = `${SERVER_END_POINT}/game`;

const client = new StompJs.Client({
  brokerURL: "wss://i10a304.p.ssafy.io/api/game",
  connectHeaders: {},
  debug: function (str) {
    console.log(str);
  },
  reconnectDelay: 300,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
});

// Fallback code
if (typeof WebSocket !== "function") {
  // For SockJS you need to set a factory that creates a new SockJS instance
  // to be used for each (re)connect
  client.webSocketFactory = function () {
    // Note that the URL is different from the WebSocket URL
    return new SockJS(SOCKET_END_POINT);
  };
}

client.onConnect = function (frame) {
  // Do something, all subscribes must be done is this callback
  // This is needed because this will be executed after a (re)connect
};

client.onStompError = function (frame) {
  // Will be invoked in case of error encountered at Broker
  // Bad login/passcode typically will cause an error
  // Complaint brokers will set `message` header with a brief message. Body may contain details.
  // Compliant brokers will terminate the connection after any error
  console.log("Broker reported error: " + frame.headers["message"]);
  console.log("Additional details: " + frame.body);
};

client.activate();
