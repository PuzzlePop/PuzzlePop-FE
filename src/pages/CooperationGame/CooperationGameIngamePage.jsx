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
import { createPortal } from "react-dom";
import Hint from "../../components/GameItemEffects/Hint";
import { useHint } from "../../hooks/useHint";

const { connect, send, subscribe, disconnect } = socket;
const {
  lockPuzzle,
  movePuzzle,
  unLockPuzzle,
  addPiece,
  addCombo,
  usingItemFrame,
  usingItemMagnet,
} = configStore;

export default function CooperationGameIngamePage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [gameData, setGameData] = useState(null);
  const [isOpenedToast, setIsOpenedToast] = useState(false);
  const [itemInventory, setItemInventory] = useState([null, null, null, null, null]);
  const { hintList, addHint, closeHint, cleanHint } = useHint();

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

  const frameTest = () => {
    const targetList = [
      0, 11, 1, 2, 13, 3, 5, 6, 10, 21, 12, 23, 14, 25, 19, 30, 20, 22, 33, 24, 35, 32, 34, 45, 36,
      44, 46, 54,
    ];
    const sortedTargetList = [...targetList].sort((a, b) => a - b);
    usingItemFrame(sortedTargetList);
  };

  const getGameInfo = () => {
    send(
      "/app/game/message",
      {},
      JSON.stringify({
        type: "GAME",
        message: "GAME_INFO",
        roomId: getRoomId(),
        sender: getSender(),
      }),
    );
  };

  const connectSocket = async () => {
    connect(
      () => {
        console.log("@@@@@@@@@@@@@@@@ 인게임 소켓 연결 @@@@@@@@@@@@@@@@@@");
        subscribe(`/topic/game/room/${roomId}`, (message) => {
          const data = JSON.parse(message.body);
          console.log(data);

          // 매번 보유아이템배열을 업데이트
          if (data.redItemList) {
            setItemInventory(data.redItemList);
          }

          // 매번 게임이 끝났는지 체크
          // TODO: 콤보로 인해 마지막 퍼즐조각이 클라이언트에서 맞춰지지 않았는데 게임종료가 되고 있음.. 이 현상 개선해야함.
          if (Boolean(data.finished)) {
            // disconnect();
            setIsOpenedToast(true);
            return;
          }

          if (data.message && data.message === "LOCKED" && data.senderId !== getSender()) {
            const { targets } = data;
            const targetList = JSON.parse(targets);
            targetList.forEach(({ x, y, index }) => lockPuzzle(x, y, index));
            return;
          }

          if (data.message && data.message === "MOVE" && data.senderId !== getSender()) {
            const { targets } = data;
            const targetList = JSON.parse(targets);
            targetList.forEach(({ x, y, index }) => movePuzzle(x, y, index));
            return;
          }

          if (data.message && data.message === "UNLOCKED" && data.senderId !== getSender()) {
            const { targets } = data;
            const targetList = JSON.parse(targets);
            targetList.forEach(({ x, y, index }) => unLockPuzzle(x, y, index));
            return;
          }

          if (data.message && data.message === "ADD_PIECE") {
            const { targets, combo, comboCnt: comboCount, redBundles } = data;
            const [fromIndex, toIndex] = targets.split(",").map((piece) => Number(piece));
            addPiece({ fromIndex, toIndex }, redBundles);
            cleanHint({ fromIndex, toIndex });
            if (combo) {
              effectCombo({ combo, comboCount });
            }
            return;
          }

          // "FRAME(액자)" 아이템 사용
          if (data.message && data.message === "FRAME") {
            const { targetList } = data;
            // usingItemFrame(targetList)
            return;
          }

          // "HINT(힌트)" 아이템 사용
          if (data.message && data.message === "HINT") {
            const { targetList } = data;
            addHint(...targetList);
            return;
          }

          // "MAGNET(자석)" 아이템 사용
          if (data.message && data.message === "MAGNET") {
            const { targetList, redBundles } = data;
            usingItemMagnet(targetList, redBundles);
            return;
          }

          // 게임정보 받기
          if (data.gameType && data.gameType === "COOPERATION") {
            setGameData(data);
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
      <button onClick={frameTest}>액자 아이템 테스트</button>
      <button onClick={getGameInfo}>게임 정보좀요</button>
      <Toast
        open={isOpenedToast}
        onClose={handleCloseGame}
        message="게임 끝! 아무대나 클릭하면 게임이 종료됩니다."
      />
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
      {document.querySelector("#canvasContainer") &&
        createPortal(
          <Hint hintList={hintList} onClose={closeHint} />,
          document.querySelector("#canvasContainer"),
        )}
    </>
  );
}

const effectCombo = ({ combo, comboCount }) => {
  combo.forEach(([toIndex, fromIndex, direction]) => addCombo(fromIndex, toIndex, direction));
  if (comboCount) {
    renderComboAlert(comboCount);
  }
  onComboSound();
};

const renderComboAlert = (comboCnt) => {
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
};

const onComboSound = () => {
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
};
