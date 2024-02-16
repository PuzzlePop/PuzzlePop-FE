import { useEffect, useState } from "react";
import styled from "styled-components";
import { IconButton, Button, createTheme, ThemeProvider } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CreateRoomButton from "@/components/GameRoomList/CreateRoomButton";
import GameRoomListBoard from "@/components/GameRoomList/GameRoomListBoard";
import { request } from "@/apis/requestBuilder";
import { getSender } from "@/socket-utils/storage";
import backgroundPath from "@/assets/backgrounds/battleBackground.gif";
import { socket } from "../../socket-utils/socket2";
import { setRoomId, setSender, setTeam } from "../../socket-utils/storage";
import { deepPurple } from "@mui/material/colors";

const { connect, send, subscribe, disconnect } = socket;

const theme = createTheme({
  typography: {
    fontFamily: "'Galmuri11', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: deepPurple[700],
          fontSize: "15px",
          height: "80%",
          backgroundColor: "#fff",
          "&:hover": {
            backgroundColor: deepPurple[100],
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          margin: "3% auto",

          "& label": {
            color: deepPurple[200],
          },
          "& label.Mui-focused": {
            color: deepPurple[700],
          },
          "& .MuiOutlinedInput-root": {
            color: deepPurple[700],
            "& fieldset": {
              borderColor: deepPurple[200],
            },
            "&:hover fieldset": {
              borderColor: deepPurple[400],
            },
            "&.Mui-focused fieldset": {
              borderColor: deepPurple[700],
            },
          },
          "& .MuiFormHelperText-root": {
            color: deepPurple[400],
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: deepPurple[200],
          "&.Mui-focused": {
            color: deepPurple[400],
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          "&.Mui-checked": {
            color: deepPurple[400],
          },
        },
      },
    },
  },
});

export default function BattleGameListPage() {
  const [roomList, setRoomList] = useState([]);

  const refetchAllRoom = () => {
    fetchAllRoom();
  };

  const fetchAllRoom = async () => {
    const res = await request.get("/game/rooms/battle", { id: getSender() });
    const { data: fetchedRoomList } = res;
    console.log(fetchedRoomList);
    setRoomList(fetchedRoomList);
  };

  useEffect(() => {
    fetchAllRoom();
  }, []);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }

  const quickMatching = () => {
    const sender = getCookie("userId");
    if (!sender) {
      alert("로그인한 유저만 이용할 수 있는 기능입니다.");
      return;
    }

    connect(() => {
      //대기 큐 입장했다고 보내기
      send(
        "/app/game/message",
        {},
        JSON.stringify({
          type: "QUICK",
          sender: sender,
          member: true,
        }),
      );

      //랜덤 매칭 큐 소켓
      subscribe(`/topic/game/room/quick/${sender}`, (message) => {
        const data = JSON.parse(message.body);
        if (data.message === "WAITING") {
          alert("waiting");
        } else if (data.message === "GAME_START") {
          setRoomId(data.targets);
          setSender(sender);
          if (data.team === "RED") {
            setTeam("red");
          } else {
            setTeam("blue");
          }
          window.location.replace(`/game/battle/ingame/${data.targets}`);
        }
      });

      //응답 메시지 파싱
    });
  };
  return (
    <Wrapper>
      <Header />

      <div
        style={{ display: "flex", alignItems: "center", width: "950px", margin: "3% auto 0 auto" }}
      >
        <h1>배틀 플레이</h1>
        <IconButton aria-label="refresh" onClick={refetchAllRoom} sx={{ marginRight: "auto" }}>
          <RefreshIcon />
        </IconButton>
        <ThemeProvider theme={theme}>
          <Button
            variant="outlined"
            onClick={quickMatching}
            style={{
              marginRight: "10px",
              fontWeight: 800,

              color: deepPurple[700],
            }}
          >
            빠른 1 VS 1 매칭
          </Button>
        </ThemeProvider>
        <CreateRoomButton category="battle" />
      </div>

      <GameRoomListBoard category="battle" roomList={roomList} />

      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 900px;
  background-image: url(${backgroundPath});
`;
