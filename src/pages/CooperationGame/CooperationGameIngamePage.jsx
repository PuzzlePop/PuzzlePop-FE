import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlayPuzzle from "../../components/PlayPuzzle";
import { getRoomId, getSender } from "../../socket-utils/storage";
import { socket } from "../../socket-utils/socket";
import { parsePuzzleShapes } from "../../socket-utils/parsePuzzleShapes";

const { connect, send, subscribe, disconnect } = socket;

export default function CooperationGameIngamePage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [gameData, setGameData] = useState(null);

  const connectSocket = async () => {
    // websocket 연결 시도
    connect(() => {
      // console.log("WebSocket 연결 성공");

      subscribe(`/topic/game/room/${roomId}`, (message) => {
        const data = JSON.parse(message.body);
        const { admin, gameId, gameName, picture, redTeam, roomSize, started, ...fetchedGameData } =
          JSON.parse(message.body);

        //랜덤 아이템 드랍(사실 배틀에 있어야하는데 여기서 테스트)
        
        if (data.randomItem) {
          // 버튼 생성
          let button = document.createElement("button");
          button.textContent = data.randomItem.name;

          // 버튼의 위치 설정
          button.style.position = "absolute";
          button.style.left = data.randomItem.position_x + "px";
          button.style.top = data.randomItem.position_y + "px";


          button.onclick = function() {
              // 부모 요소로부터 버튼 제거
              //근데 이거 다른 클라이언트들도 이 아이템 먹었다고 버튼 사라지는 이벤트 처리하든가 해야함.
              button.parentNode.removeChild(button);
              

              
              // 서버로 메시지 전송
              send(
                "/app/game/message",
                {},
                JSON.stringify({
                  type: "GAME",
                  roomId: getRoomId(),
                  sender: getSender(),
                  message: "USE_RANDOM_ITEM",
                  targets: data.randomItem.name
                }),
              );
          };

          // 버튼을 body에 추가
          document.body.appendChild(button);

          // alert 대신 메시지를 콘솔에 출력
          console.log(data.randomItem.name + " 을 " + data.randomItem.position_x + " " + data.randomItem.position_y + " 에 생성한다!");
        }
        

        // 1. 게임이 끝나면 대기실 화면으로 보낸다.
        //여기 수정함
        if (data.finished === true) {
          alert("게임 끝남!!")
          window.location.href = `/game/cooperation/waiting/${gameId}`;
          return;
        }

        // 2. 게임정보 받기
        if (data.gameType && data.gameType === "COOPERATION") {
          setGameData(fetchedGameData);
          return;
        }
      });

      // 서버로 메시지 전송
      send(
        "/app/game/message",
        {},
        JSON.stringify({
          type: "ENTER",
          roomId: getRoomId(),
          sender: getSender(),
        }),
      );
    });
  };

  useEffect(() => {
    if (roomId !== getRoomId() || !getSender()) {
      navigate("/game/cooperation", {
        replace: true,
      });
      return;
    }

    connectSocket();
    setLoading(false);

    return () => {
      disconnect();
      // console.log("WebSocket 연결 종료");
    };

    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <h1>게임 정보를 받아오는 중...</h1>;
  }

  console.log(gameData);

  return (
    <>
      <h1>CooperationGameIngamePage : {roomId}</h1>
      {gameData && gameData.redPuzzle && gameData.redPuzzle.board && (
        <PlayPuzzle shapes={parsePuzzleShapes(gameData.redPuzzle.board[0])} />
      )}
    </>
  );
}
