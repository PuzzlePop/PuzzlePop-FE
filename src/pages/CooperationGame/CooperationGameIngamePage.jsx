import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlayPuzzle from "@/components/PlayPuzzle";
import Loading from "@/components/Loading";
import { getRoomId, getSender, getTeam } from "@/socket-utils/storage";
import { socket } from "@/socket-utils/socket";
import { parsePuzzleShapes } from "@/socket-utils/parsePuzzleShapes";
import comboAudioPath from "@/assets/audio/combo.mp3";
// import { usePuzzleConfig } from "../../hooks/usePuzzleConfig";
import ItemController from "../../components/ItemController";
import { configStore } from "../../puzzle-core";

const { connect, send, subscribe } = socket;
const { getConfig, lockPuzzle, movePuzzle, unLockPuzzle, addPiece, addCombo } = configStore;

export default function CooperationGameIngamePage() {
  // const { config, lockPuzzle, movePuzzle, unLockPuzzle, addPiece, addCombo } = usePuzzleConfig();

  const navigate = useNavigate();
  const { roomId } = useParams();
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState(null);

  const finishGame = (data) => {
    if (data.finished === true) {
      window.alert("게임이 종료되었습니다.");
      window.location.href = `/game/cooperation/waiting/${roomId}`;
      return;
    }
  };

  const initializeGame = (data) => {
    setGameData(data);
    console.log("gamedata is here!", gameData, data);
  };

  const connectSocket = async () => {
    connect(
      () => {
        console.log("@@@@@@@@@@@@@@@@ 인게임 소켓 연결 @@@@@@@@@@@@@@@@@@");
        subscribe(`/topic/game/room/${roomId}`, (message) => {
          const data = JSON.parse(message.body);
          console.log(data);

          // 2. 게임정보 받기
          if (data.gameType && data.gameType === "COOPERATION") {
            initializeGame(data);
            return;
          }

          if (data.message && data.message === "LOCKED") {
            const { targets } = data;
            const targetList = JSON.parse(targets);
            targetList.forEach(({ x, y, index }) => lockPuzzle(x, y, index));
            return;
          }

          if (data.message && data.message === "MOVE") {
            const { targets } = data;
            const targetList = JSON.parse(targets);
            targetList.forEach(({ x, y, index }) => movePuzzle(x, y, index));
            return;
          }

          if (data.message && data.message === "UNLOCKED") {
            const { targets } = data;
            const targetList = JSON.parse(targets);
            targetList.forEach(({ x, y, index }) => unLockPuzzle(x, y, index));
            return;
          }

          if (data.message && data.message === "ADD_PIECE") {
            const { targets, combo } = data;
            const [fromIndex, toIndex] = targets.split(",").map((piece) => Number(piece));
            addPiece({ fromIndex, toIndex });

            if (combo) {
              console.log("콤보 효과 발동 !! : ", combo);
              combo.forEach(([toIndex, fromIndex, direction]) =>
                addCombo(fromIndex, toIndex, direction),
              );

              const audio = new Audio(comboAudioPath);
              audio.loop = false;
              audio.crossOrigin = "anonymous";
              audio.volume = 0.5;
              audio.load();
              try {
                audio.play();
              } catch (err) {
                console.log(err);
              }
            }

            finishGame(data);
            return;
          }

          //랜덤 아이템 드랍(사실 배틀에 있어야하는데 여기서 테스트)
          if (data.randomItem) {
            // 버튼 생성
            const button = document.createElement("button");
            button.textContent = data.randomItem.name;

            // 버튼의 위치 설정
            button.style.position = "absolute";
            button.style.left = data.randomItem.position_x + "px";
            button.style.top = data.randomItem.position_y + "px";

            button.onclick = function () {
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
                  targets: data.randomItem.uuid,
                }),
              );
            };

            // 버튼을 body에 추가
            document.body.appendChild(button);

            // alert 대신 메시지를 콘솔에 출력
            console.log(
              data.randomItem.name +
                " 을 " +
                data.randomItem.position_x +
                " " +
                data.randomItem.position_y +
                " 에 생성한다!",
            );
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
      },
      () => {
        console.log("@@@@@@@@@@@@@@@@@@@@@socket error 발생@@@@@@@@@@@@@@@@@@@@@");
        // window.alert("게임이 종료되었거나 입장할 수 없습니다.");
        // navigate(`/game/cooperation`, {
        //   replace: true,
        // });
      },
    );
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

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (gameData) {
      console.log(gameData);
      setLoading(false);
    }
  }, [gameData]);

  return (
    <>
      <h1>CooperationGameIngamePage : {roomId}</h1>
      {loading ? (
        <Loading message="게임 정보 받아오는 중..." />
      ) : (
        gameData &&
        gameData[`${getTeam()}Puzzle`] &&
        gameData[`${getTeam()}Puzzle`].board && (
          <>
            <PlayPuzzle
              category="cooperation"
              shapes={parsePuzzleShapes(
                gameData[`${getTeam()}Puzzle`].board,
                gameData.picture.widthPieceCnt,
                gameData.picture.lengthPieceCnt,
              )}
              board={gameData[`${getTeam()}Puzzle`].board}
              picture={gameData.picture}
            />
            {/* <ItemController /> */}
          </>
        )
      )}
    </>
  );
}
