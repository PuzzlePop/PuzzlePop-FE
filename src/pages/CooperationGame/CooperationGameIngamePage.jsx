import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import comboAudioPath from "@/assets/audio/combo.mp3";
import PlayPuzzle from "@/components/PlayPuzzle";
import Loading from "@/components/Loading";
import Toast from "../../components/Toast";
import ItemController from "../../components/ItemController";
import { configStore } from "../../puzzle-core";
import { socket } from "../../socket-utils/socket";
import { getRoomId, getSender, getTeam } from "../../socket-utils/storage";
import { parsePuzzleShapes } from "../../socket-utils/parsePuzzleShapes";

const { connect, send, subscribe, disconnect } = socket;
const { lockPuzzle, movePuzzle, unLockPuzzle, addPiece, addCombo } = configStore;

export default function CooperationGameIngamePage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [gameData, setGameData] = useState(null);
  const [isOpenedToast, setIsOpenedToast] = useState(false);
  const [itemInventory, setItemInventory] = useState([null, null, null, null, null]);

  const isLoaded = useMemo(() => {
    return gameData && gameData[`${getTeam()}Puzzle`] && gameData[`${getTeam()}Puzzle`].board;
  }, [gameData]);

  const handleCloseGame = () => {
    setIsOpenedToast(false);
    navigate(`/game/cooperation`, {
      replace: true,
    });
  };

  const handleSendUseItemMessage = useCallback((keyNumber) => {
    send(
      "/app/game/message",
      {},
      JSON.stringify({
        type: "GAME",
        roomId: getRoomId(),
        sender: getSender(),
        message: "USE_ITEM",
        targets: keyNumber,
      }),
    );
  }, []);

  const connectSocket = async () => {
    connect(
      () => {
        console.log("@@@@@@@@@@@@@@@@ 인게임 소켓 연결 @@@@@@@@@@@@@@@@@@");
        subscribe(`/topic/game/room/${roomId}`, (message) => {
          const data = JSON.parse(message.body);
          console.log(data);

          // 매번 게임이 끝났는지 체크
          if (Boolean(data.finished)) {
            disconnect();
            setIsOpenedToast(true);
            return;
          }

          // 매번 보유아이템배열을 업데이트
          if (data.redItemList) {
            setItemInventory(data.redItemList);
          }

          // 게임정보 받기
          if (data.gameType && data.gameType === "COOPERATION") {
            setGameData(data);
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
            const { targets, combo, comboCnt } = data;
            const [fromIndex, toIndex] = targets.split(",").map((piece) => Number(piece));
            addPiece({ fromIndex, toIndex });

            if (combo) {
              console.log("콤보 효과 발동 !! : ", combo);
              combo.forEach(([toIndex, fromIndex, direction]) =>
                addCombo(fromIndex, toIndex, direction),
              );

              if (comboCnt) {
                console.log(`${comboCnt} 콤보문구 생성`);
                const comboText = document.createElement("h2");
                const canvasContainer = document.getElementById("canvasContainer");
                comboText.textContent = `${comboCnt}COMBO!!`;

                comboText.style.zIndex = 100;
                comboText.style.position = "fixed";
                comboText.style.left = "50%";
                comboText.style.top = "40px";
                comboText.style.transform = "translate(-50%, 0)";
                comboText.style.fontSize = "30px";

                canvasContainer.appendChild(comboText);

                console.log(comboText);
                setTimeout(() => {
                  console.log("콤보 문구 삭제");
                  console.log(comboText);
                  console.log(comboText.parentNode);
                  console.log(comboText.parentElement);
                  comboText.parentNode.removeChild(comboText);
                }, 2000);
              }

              const audio = new Audio(comboAudioPath);
              audio.loop = false;
              audio.crossOrigin = "anonymous";
              // audio.volume = 0.5;
              audio.load();
              try {
                audio.play();
              } catch (err) {
                console.log(err);
              }
            }
            return;
          }

          // "FRAME(액자)" 아이템 사용
          if (data.message && data.message === "FRAME") {
            const { targetList } = data;
            console.log("액자 사용한다~~!!!");
            // targetList에 나온 index를 다 맞춰버린다.
            return;
          }

          // "HINT(힌트)" 아이템 사용
          if (data.message && data.message === "HINT") {
            console.log("힌트 사용한다~~!!!");
            return;
          }

          // "MAGNET(자석)" 아이템 사용
          if (data.message && data.message === "MAGNET") {
            console.log("자석 사용한다~~!!!");
            return;
          }

          // if ()
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

    // eslint-disable-next-line
  }, []);

  if (!isLoaded) {
    return <Loading message="게임 정보 받아오는 중..." />;
  }

  return (
    <>
      <Toast open={isOpenedToast} onClose={handleCloseGame} message="게임 끝!!!" />
      <h1>CooperationGameIngamePage : {roomId}</h1>
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
      <ItemController
        itemInventory={itemInventory}
        onSendUseItemMessage={handleSendUseItemMessage}
      />
    </>
  );
}
