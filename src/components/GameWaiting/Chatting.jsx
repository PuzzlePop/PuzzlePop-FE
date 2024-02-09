import { useState } from "react";
import { getSender, getRoomId } from "@/socket-utils/storage";
import { socket } from "@/socket-utils/socket";

const { send } = socket;

export default function Chatting({ chatHistory }) {
  console.log(chatHistory);
  const [message, setMessage] = useState("");

  const handleMessageSend = (e) => {
    e.preventDefault();
    if (getSender()) {
      send(
        `/app/game/message`,
        {},
        JSON.stringify({
          roomId: getRoomId(),
          sender: getSender(),
          message,
          type: "CHAT",
        }),
      );
      setMessage("");
    }
  };

  return (
    <div>
      {chatHistory && (
        <div style={{ marginBottom: "10px" }}>
          {/* 채팅 기록을 화면에 출력 */}
          {chatHistory.map((chat, index) => (
            <div key={index}>
              <strong>
                {chat.userid}[{chat.time}]:{" "}
              </strong>
              {chat.chatMessage}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleMessageSend}>
        <input
          type="text"
          placeholder="채팅"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
