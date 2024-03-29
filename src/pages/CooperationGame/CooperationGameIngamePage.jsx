import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import styled from "styled-components";

import PlayPuzzle from "@/components/PlayPuzzle";
import Loading from "@/components/Loading";
import ItemInventory from "@/components/ItemInventory";
import Hint from "../../components/Hint";
import PrograssBar from "@/components/GameIngame/ProgressBar";
import Timer from "@/components/GameIngame/Timer";
import Chatting from "@/components/GameWaiting/Chatting";

import { configStore } from "@/puzzle-core";
import { addAudio } from "@/puzzle-core/attackItem";
import { socket } from "@/socket-utils/socket2";
import { getRoomId, getSender, getTeam } from "@/socket-utils/storage";
import { parsePuzzleShapes } from "@/socket-utils/parsePuzzleShapes";
import { useHint } from "@/hooks/useHint";

import comboAudioPath from "@/assets/audio/combo.mp3";
import hintAudioPath from "@/assets/audio/hint.mp3";
import magnetAudioPath from "@/assets/audio/magnet.mp3";
import frameAudioPath from "@/assets/audio/frame.mp3";
import cooperationBackgroundPath from "@/assets/backgrounds/cooperationBackground.gif";

import { Box, Dialog, DialogTitle, Snackbar } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";
import { useInventory } from "../../hooks/useInventory";
import { useSnackbar2 } from "../../hooks/useSnackbar2";

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
  const [isOpenedDialog, setIsOpenedDialog] = useState(false);

  const [time, setTime] = useState(0);
  const [ourPercent, setOurPercent] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [pictureSrc, setPictureSrc] = useState("");

  const { prevItemInventory, itemInventory, updateInventory } = useInventory();
  const { hintList, addHint, setHintList, cleanHint } = useHint();
  const {
    isShowSnackbar,
    onClose: onCloseSnackbar,
    setSnackMessage,
    snackMessage,
  } = useSnackbar2({
    autoClosing: true,
  });

  const isLoaded = useMemo(() => {
    return gameData && gameData[`${getTeam()}Puzzle`] && gameData[`${getTeam()}Puzzle`].board;
  }, [gameData]);

  const handleCloseGame = () => {
    setIsOpenedDialog(false);
    navigate(`/game/cooperation`, {
      replace: true,
    });
  };

  const handleUseItem = useCallback((keyNumber) => {
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
            // disconnect();
            console.log("게임 끝남 !");
            // TODO : 게임 끝났을 때 effect
            setTimeout(() => {
              setIsOpenedDialog(true);
            }, 1000);
            // return;
          }

          // 매번 보유아이템배열을 업데이트
          if (data.redItemList) {
            updateInventory(data.redItemList);
          }

          // timer 설정
          if (!data.gameType && data.time) {
            setTime(data.time);
          }

          // 게임정보 받기
          if (data.gameType && data.gameType === "COOPERATION") {
            setGameData(data);
            return;
          }

          // 진행도
          // TODO : ATTACK일때 시간 초 늦게 반영되는 효과
          if (data.redProgressPercent >= 0) {
            console.log("진행도?", data.redProgressPercent);
            setOurPercent(data.redProgressPercent);
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
            const { targetList, redBundles } = data;
            if (targetList.length === 0) {
              setSnackMessage(
                "액자 효과를 받을 퍼즐이 하나도 없네요... 다음에는 조금 더 아껴놨다가 써보세요.",
              );
              return;
            }
            addAudio(frameAudioPath);
            if (targetList.length < 7) {
              setSnackMessage("액자 아이템이 사용됐어요.");
              usingItemFrame(targetList, redBundles);
              return;
            }
            setSnackMessage("액자 효과는 굉장했다!!!");
            usingItemFrame(targetList, redBundles);
            return;
          }

          // "HINT(힌트)" 아이템 사용
          if (data.message && data.message === "HINT") {
            const { targetList } = data;
            addHint(...targetList);
            addAudio(hintAudioPath);
            setSnackMessage("반짝이는 두 개의 인접한 퍼즐을 맞춰봐요!");
            return;
          }

          // "MAGNET(자석)" 아이템 사용
          if (data.message && data.message === "MAGNET") {
            const { targetList, redBundles } = data;
            if (targetList.length === 0) {
              setSnackMessage("운이 없게도 자석 아이템을 사용했지만 아무 효과도 없었다...");
              return;
            }
            addAudio(magnetAudioPath);
            setSnackMessage("자석 아이템 사용!");
            usingItemMagnet(targetList, redBundles);
            return;
          }

          // 게임정보 받기
          if (data.gameType && data.gameType === "COOPERATION") {
            setGameData(data);
            return;
          }
        });

        // 채팅
        subscribe(`/topic/chat/room/${roomId}`, (message) => {
          const data = JSON.parse(message.body);
          console.log("채팅왔다", data);
          const { userid, chatMessage, time, teamColor } = data;

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

  useEffect(() => {
    if (gameData) {
      const tempSrc =
        gameData.picture.encodedString === "짱구.jpg"
          ? "https://i.namu.wiki/i/1zQlFS0_ZoofiPI4-mcmXA8zXHEcgFiAbHcnjGr7RAEyjwMHvDbrbsc8ekjZ5iWMGyzJrGl96Fv5ZIgm6YR_nA.webp"
          : `data:image/jpeg;base64,${gameData.picture.encodedString}`;

      setPictureSrc(tempSrc);
    }
  }, [gameData]);

  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
  });

  if (!isLoaded) {
    return (
      <Wrapper>
        <Loading message="게임 정보 받아오는 중..." />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Board>
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
        <Row>
          <ProgressWrapper>
            <PrograssBar percent={ourPercent} isEnemy={false} />
          </ProgressWrapper>
        </Row>

        <Col>
          <Timer num={time} isCooperation="true" />
          <h3>이 그림을 맞춰주세요!</h3>
          <img
            src={pictureSrc}
            alt="퍼즐 그림"
            style={{ width: "100%", borderRadius: "10px", margin: "5px" }}
          />
          <Chatting chatHistory={chatHistory} isIngame={true} isBattle={false} />
        </Col>
      </Board>

      <ItemInventory
        prevItemInventory={prevItemInventory}
        itemInventory={itemInventory}
        onUseItem={handleUseItem}
      />
      {document.querySelector("#canvasContainer") &&
        createPortal(
          <Hint hintList={hintList} setHintList={setHintList} />,
          document.querySelector("#canvasContainer"),
        )}

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={isShowSnackbar}
        autoHideDuration={3000}
        onClose={onCloseSnackbar}
        message={snackMessage}
      />

      <ThemeProvider theme={theme}>
        <Dialog open={isOpenedDialog} onClose={handleCloseGame}>
          <DialogTitle>게임 결과</DialogTitle>
        </Dialog>
      </ThemeProvider>
    </Wrapper>
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
  audio.volume = 0.4;
  audio.load();
  try {
    audio.play();
  } catch (err) {
    console.log(err);
  }
};
const Wrapper = styled.div`
  height: 100vh;
  min-height: 1000px;
  background-image: url(${cooperationBackgroundPath});
`;

const Row = styled(Box)`
  display: flex;
  height: 100%;
  margin-left: 10px;
`;

const Col = styled(Box)`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  margin-left: 10px;
`;

const Board = styled.div`
  width: 1320px;
  height: 754px;
  display: flex;
  position: relative;
  top: 50px;
  margin: auto;
  padding: 2%;
  padding-right: 1.5%;
  border-radius: 20px;
  border: 3px solid ${deepPurple[400]};
  background-color: rgba(255, 255, 255, 0.8);
`;

const ProgressWrapper = styled(Box)`
  margin: 0 1px;
  display: inline-block;
  transform: rotate(180deg);
`;
