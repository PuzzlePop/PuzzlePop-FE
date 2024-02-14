import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import GameOpenVidu from "@/components/GameIngame/openvidu/GameOpenVidu";
import { getSender, getRoomId, getTeam } from "@/socket-utils/storage";
import { socket } from "@/socket-utils/socket2";
import { TextField, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, blue, deepPurple } from "@mui/material/colors";

const { send } = socket;

export default function Chatting({ chatHistory, isIngame = false, isBattle = false }) {
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
      redTeam: {
        light: red[300],
        main: red[400],
        dark: red[500],
        darker: red[600],
        contrastText: "#fff",
      },
      blueTeam: {
        light: blue[300],
        main: blue[400],
        dark: blue[500],
        darker: blue[600],
        contrastText: "#fff",
      },
      purple: {
        light: deepPurple[200],
        main: deepPurple[300],
        dark: deepPurple[400],
        darker: deepPurple[600],
        contrastText: "#fff",
      },
    },
  });

  const currentTheme = !isBattle ? "purple" : getTeam() === "red" ? "redTeam" : "blueTeam";
  const currentScrollbarTheme = !isBattle
    ? deepPurple[300]
    : getTeam() === "red"
      ? red[300]
      : blue[300];

  return (
    <ThemeProvider theme={theme}>
      <Wrapper $isIngame={isIngame}>
        {chatHistory && (
          <div
            ref={chatElement}
            style={{
              flexGrow: 1,
              margin: "10px",
              overflowY: "scroll",
              scrollbarColor: `${currentScrollbarTheme} rgba(255, 255, 255, 0)`,
            }}
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
          {isIngame ? (
            <GameOpenVidu
              gameId={`${getRoomId()}_${getTeam()}`}
              playerName={getSender()}
              color={currentTheme}
            />
          ) : (
            <GameOpenVidu gameId={getRoomId()} playerName={getSender()} />
          )}
          <ChatInput
            type="text"
            placeholder="채팅"
            size="small"
            color={currentTheme}
            autoComplete="off"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <ChatBtn variant="outlined" color={currentTheme} type="submit">
            Send
          </ChatBtn>
        </Form>
      </Wrapper>
    </ThemeProvider>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: ${(props) => {
    if (props.$isIngame) {
      return "750px";
    } else {
      return "200px";
    }
  }};
  margin: 0 3px;
`;

const Form = styled.form`
  height: 50px;
  display: flex;
`;

const ChatInput = styled(TextField)`
  width: 74%;
  height: 50px;
  margin: 0;
  margin-left: auto;

  & .MuiInputBase-input {
    padding: 10px 14px;
    height: 20px;
  }
`;

const ChatBtn = styled(Button)`
  width: 16%;
  margin-left: 4px;
  height: 40px;
`;
