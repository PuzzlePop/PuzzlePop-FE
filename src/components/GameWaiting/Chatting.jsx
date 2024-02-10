import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { getSender, getRoomId } from "@/socket-utils/storage";
import { socket } from "@/socket-utils/socket";
import { TextField, Button } from "@mui/material";

const { send } = socket;

export default function Chatting({ chatHistory }) {
  const [message, setMessage] = useState("");
  const [lastHeight, setLastHeight] = useState(null);
  const chatElement = useRef();

  const handleMessageSend = (e) => {
    e.preventDefault();
    if (getSender() && message) {
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

  const onScroll = (event) => {
    const chat = event.target;

    if (chat.scrollTop === 0) {
      console.log("ON TOP");
      const { scrollHeight } = chatElement.current;
      setLastHeight(scrollHeight);
      // loadMessages();
    }
  };

  useEffect(() => {
    const { scrollTop, scrollHeight, clientHeight } = chatElement.current;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      chatElement.current.scrollTop = scrollHeight;
      return;
    }

    if (!lastHeight) {
      chatElement.current.scrollTop = scrollHeight;
    } else {
      if (scrollTop === 0) {
        const diff = scrollHeight - lastHeight;
        chatElement.current.scrollTop = diff;
      }
    }
  }, [chatHistory, lastHeight]);

  return (
    <div>
      {chatHistory && (
        <div
          ref={chatElement}
          onScroll={onscroll}
          style={{ height: "200px", marginBottom: "10px", overflow: "scroll" }}
        >
          {/* 채팅 기록을 화면에 출력 */}
          {chatHistory.map((chat, index) => (
            <div key={index}>
              <strong>{chat.userid}: </strong>
              {chat.chatMessage}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleMessageSend}>
        <ChatInput
          type="text"
          placeholder="채팅"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <ChatBtn type="submit">Send</ChatBtn>
      </form>
    </div>
  );
}

const ChatInput = styled(TextField)`
  width: 80%;
`;

const ChatBtn = styled(Button)`
  width: 20%;
`;
