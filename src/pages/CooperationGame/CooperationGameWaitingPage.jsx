import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { isAxiosError } from "axios";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameWaitingBoard from "@/components/GameWaiting/GameWaitingBoard";
import Loading from "@/components/Loading";

import { getSender, getRoomId } from "@/socket-utils/storage";
// import { socket } from "@/socket-utils/socket";
import createSocket from "@/socket-utils/socket2";

import { request } from "@/apis/requestBuilder";

import backgroundPath from "@/assets/backgrounds/background.gif";

// const { connect, send, subscribe } = socket;

export default function CooperationGameWaitingPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [gameData, setGameData] = useState(null);
  const [chatHistory, setChatHistory] = useState([]); // 채팅 기록을 저장하는 상태 추가

  const isLoading = useMemo(() => {
    return gameData === null;
  }, [gameData]);

  const connectSocket = async () => {
    const socket = createSocket(roomId);
    const {connect, send, subscribe} = socket;
    
    // websocket 연결 시도
    connect(() => {
      console.log("@@@@@@@@@@@@@@@@ 대기실 소켓 연결 @@@@@@@@@@@@@@@@@@");

      subscribe(`/topic/game/room/${roomId}`, (message) => {
        const data = JSON.parse(message.body);

        // 1. 게임이 시작되면 인게임 화면으로 보낸다.
        if (data.gameId && Boolean(data.started) && !Boolean(data.finished)) {
          window.location.replace(`/game/cooperation/ingame/${data.gameId}`);
          return;
        }
        setGameData(data);
      });

      subscribe(`/topic/chat/room/${roomId}`, (message) => {
        const data = JSON.parse(message.body);
        const { userid, chatMessage, time } = data;
        const receivedMessage = { userid, chatMessage, time }; // 받은 채팅
        setChatHistory((prevChat) => [...prevChat, receivedMessage]); // 채팅 기록에 새로운 채팅 추가
      });

      // 서버로 메시지 전송
      send(
        "/app/game/message",
        {},
        JSON.stringify({
          type: "ENTER",
          roomId: getRoomId(),
          sender: getSender(),
          member: getCookie("userId") ? true : false,
        }),
      );
    });
  };

  //쿠키 확인
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }

  const initialize = async () => {
    try {
      await request.post(`/game/room/${roomId}`, { id: getSender() });
      await connectSocket();
    } catch (e) {
      if (isAxiosError(e) && e.response.status >= 400) {
        navigate("/game/cooperation", {
          replace: true,
        });
      }
    }
  };

  useEffect(() => {
    if (roomId !== getRoomId() || !getSender()) {
      navigate("/game/cooperation", {
        replace: true,
      });
      return;
    }

    initialize();

    // eslint-disable-next-line
  }, []);

  return (
    <Wrapper>
      <Header />
      {isLoading ? (
        <Loading message="방 정보 불러오는 중..." />
      ) : (
        <GameWaitingBoard
          player={getSender()}
          data={gameData}
          allowedPiece={allowedPiece}
          category="cooperation"
          chatHistory={chatHistory}
        />
      )}
      <Footer />
    </Wrapper>
  );
}

const allowedPiece = [100, 200, 300, 400, 500];

const Wrapper = styled.div`
  height: 1000px;
  background-image: url(${backgroundPath});
`;
