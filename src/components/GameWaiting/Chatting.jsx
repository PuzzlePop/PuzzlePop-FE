import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { getSender, getRoomId } from "@/socket-utils/storage";
import { socket } from "@/socket-utils/socket";
import { TextField, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";

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

  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
    palette: {
      purple: {
        light: deepPurple[200],
        main: deepPurple[300],
        dark: deepPurple[400],
        darker: deepPurple[600],
        contrastText: "#fff",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        {chatHistory && (
          <div
            ref={chatElement}
            style={{ height: "75%", marginBottom: "10px", overflow: "scroll" }}
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

        <Form onSubmit={handleMessageSend}>
          <ChatInput
            type="text"
            placeholder="채팅"
            size="small"
            color="purple"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <ChatBtn variant="outlined" color="purple" type="submit">
            Send
          </ChatBtn>
        </Form>
      </Wrapper>
    </ThemeProvider>
  );
}

const Wrapper = styled.div`
  height: 200px;
`;

const Form = styled.form`
  height: 25%;
  display: flex;
`;

const ChatInput = styled(TextField)`
  width: 80%;
  height: 100%;
`;

const ChatBtn = styled(Button)`
  width: 16%;
  margin: 0 auto;
  height: 80%;
`;
