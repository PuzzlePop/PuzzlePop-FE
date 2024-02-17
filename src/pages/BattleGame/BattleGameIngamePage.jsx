import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import PlayPuzzle from "@/components/PlayPuzzle";
import Loading from "@/components/Loading";
import Timer from "@/components/GameIngame/Timer";
import PrograssBar from "@/components/GameIngame/ProgressBar";
import Chatting from "@/components/GameWaiting/Chatting";
import ItemInventory from "@/components/ItemInventory";
import ResultModal from "@/components/GameIngame/ResultModal";

import { getRoomId, getSender, getTeam } from "@/socket-utils/storage";
import { socket } from "@/socket-utils/socket2";
import { parsePuzzleShapes } from "@/socket-utils/parsePuzzleShapes";
import { configStore } from "@/puzzle-core";
import { attackFire, attackRocket, attackEarthquake, addAudio } from "@/puzzle-core/attackItem";
import { updateGroupByBundles } from "@/puzzle-core/utils";

import comboAudioPath from "@/assets/audio/combo.mp3";
import hintAudioPath from "@/assets/audio/hint.mp3";
import magnetAudioPath from "@/assets/audio/magnet.mp3";
import frameAudioPath from "@/assets/audio/frame.mp3";
import redTeamBackgroundPath from "@/assets/backgrounds/redTeamBackground.gif";
import blueTeamBackgroundPath from "@/assets/backgrounds/blueTeamBackground.gif";
import dropRandomItemPath from "@/assets/effects/dropRandomItem.gif";

import { Box, Dialog, DialogTitle, DialogContent, Snackbar } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, blue, deepPurple } from "@mui/material/colors";
import { useHint } from "@/hooks/useHint";
import Hint from "../../components/Hint";
import { createPortal } from "react-dom";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useInventory } from "../../hooks/useInventory";
import { useSnackbar2 } from "../../hooks/useSnackbar2";

const { connect, send, subscribe, disconnect } = socket;
const {
  getConfig,
  lockPuzzle,
  movePuzzle,
  unLockPuzzle,
  addPiece,
  addCombo,
  usingItemFire,
  usingItemRocket,
  usingItemEarthquake,
  usingItemFrame,
  usingItemMagnet,
} = configStore;

export default function BattleGameIngamePage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [gameData, setGameData] = useState(null);
  const [isOpenedDialog, setIsOpenedDialog] = useState(false);

  const [time, setTime] = useState(0);
  const [ourPercent, setOurPercent] = useState(0);
  const [enemyPercent, setEnemyPercent] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [pictureSrc, setPictureSrc] = useState("");

  const {
    prevItemInventory: prevRedItemInventory,
    itemInventory: redItemInventory,
    updateInventory: setRedItemInventory,
  } = useInventory();
  const {
    prevItemInventory: prevBlueItemInventory,
    itemInventory: blueItemInventory,
    updateInventory: setBlueItemInventory,
  } = useInventory();

  const { isShowSnackbar, setIsShowSnackbar, snackMessage, setSnackMessage } = useSnackbar({
    autoClosing: true,
  });

  const {
    isShowSnackbar: isShowRedSnackbar,
    onClose: onCloseRedSnackbar,
    setSnackMessage: setRedSnackMessage,
    snackMessage: redSnackMessage,
  } = useSnackbar2({
    autoClosing: true,
  });

  const {
    isShowSnackbar: isShowBlueSnackbar,
    onClose: onCloseBlueSnackbar,
    setSnackMessage: setBlueSnackMessage,
    snackMessage: BlueSnackMessage,
  } = useSnackbar2({
    autoClosing: true,
  });

  const {
    hintList: redHintList,
    addHint: redAddHint,
    setHintList: setRedHintList,
    cleanHint: redCleanHint,
  } = useHint();
  const {
    hintList: blueHintList,
    addHint: blueAddHint,
    setHintList: setBlueHintList,
    cleanHint: blueCleanHint,
  } = useHint();

  const dropRandomItemElement = useRef(null);
  const currentDropRandomItem = useRef(null);

  const numOfUsingItemRed = {
    positiveItem: useRef(0),
    attackItem: useRef(0),
  };
  const numOfUsingItemBlue = {
    positiveItem: useRef(0),
    attackItem: useRef(0),
  };

  const changeNumOfUsing = (targets, isPositive) => {
    if (isPositive) {
      if (targets === "RED") {
        numOfUsingItemRed.positiveItem.current += 1;
      } else {
        numOfUsingItemBlue.positiveItem.current += 1;
      }
    } else {
      if (targets === "RED") {
        numOfUsingItemRed.attackItem.current += 1;
      } else {
        numOfUsingItemBlue.attackItem.current += 1;
      }
    }
  };

  const isLoaded = useMemo(() => {
    return gameData && gameData[`${getTeam()}Puzzle`] && gameData[`${getTeam()}Puzzle`].board;
  }, [gameData]);

  const handleCloseGame = () => {
    setIsOpenedDialog(false);
    navigate(`/game/battle`, {
      replace: true,
    });
  };

  const handleSnackClose = () => {
    setIsShowSnackbar(false);
  };

  const initializeGame = (data) => {
    setGameData(data);
    console.log("gamedata is here!", gameData, data);
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

  const changePercent = (data) => {
    if (getTeam() === "red") {
      setOurPercent(data.redProgressPercent);
      setEnemyPercent(data.blueProgressPercent);
    } else {
      setOurPercent(data.blueProgressPercent);
      setEnemyPercent(data.redProgressPercent);
    }
  };

  const attackItemSwitch = (data, isMirror = false) => {
    console.log(data);
    const { targets, targetList, deleted, randomItem, redBundles, blueBundles } = data;
    const attackedTeamBundles = targets === "RED" ? redBundles : blueBundles;

    const usingTargets = targets === "RED" ? "BLUE" : "RED";
    changeNumOfUsing(usingTargets, false);

    if (randomItem.name === "FIRE") {
      console.log("랜덤 아이템 fire 였어!");

      attackFire(
        targets,
        targetList,
        deleted,
        attackedTeamBundles,
        setSnackMessage,
        setIsShowSnackbar,
        isMirror,
      );
    }

    if (randomItem.name === "ROCKET") {
      console.log("랜덤 아이템 rocket 였어!");
      attackRocket(
        targets,
        targetList,
        deleted,
        attackedTeamBundles,
        setSnackMessage,
        setIsShowSnackbar,
        isMirror,
      );
    }

    if (randomItem.name === "EARTHQUAKE") {
      console.log("랜덤 아이템 earthquake 였어!");

      console.log("지진 발동", data);

      attackEarthquake(
        targets,
        targetList,
        deleted,
        attackedTeamBundles,
        setSnackMessage,
        setIsShowSnackbar,
        isMirror,
      );
    }
  };
  // const temp = true;

  const connectSocket = async () => {
    connect(
      () => {
        console.log("@@@@@@@@@@@@@@@@ 인게임 소켓 연결 @@@@@@@@@@@@@@@@@@");
        subscribe(`/topic/game/room/${roomId}`, (message) => {
          const data = JSON.parse(message.body);
          console.log(data);

          // console.log(
          //   data.finished,
          //   Boolean(data.finished),
          //   data.redProgressPercent === 100,
          //   data.blueProgressPercent === 100,
          //   data.time,
          // );
          // console.log(
          //   Boolean(data.finished) ||
          //     data.redProgressPercent === 100 ||
          //     data.blueProgressPercent === 100 ||
          //     (data.time !== undefined && data.time <= 0),
          // );

          // 매번 게임이 끝났는지 체크
          if (data.finished === true) {
            // if (temp === true) {
            // disconnect();
            console.log("게임 끝남 !"); // TODO : 게임 끝났을 때 effect
            console.log(data, gameData);
            setTimeout(() => {
              setIsOpenedDialog(true);
            }, 1000);
            // return;
          }

          // timer 설정
          if (!data.gameType && data.time) {
            setTime(data.time);
          }

          // 매번 보유아이템배열을 업데이트
          if (data.redItemList) {
            setRedItemInventory(data.redItemList);
          }
          if (data.blueItemList) {
            setBlueItemInventory(data.blueItemList);
          }

          // 게임정보 받기
          if (data.gameType && data.gameType === "BATTLE") {
            initializeGame(data);
            setTimeout(() => {
              console.log("번들로 그룹화 해볼게", getConfig(), data[`${getTeam()}Puzzle`].bundles);
              updateGroupByBundles({
                config: getConfig(),
                bundles: data[`${getTeam()}Puzzle`].bundles,
              });
            }, 400);

            return;
          }

          // 진행도
          // ATTACK일때 2초 뒤(효과 지속 시간과 동일) 반영
          // MIRROR일때 3초 뒤(효과 지속 시간과 동일) 반영
          if (data.redProgressPercent >= 0 && data.blueProgressPercent >= 0) {
            console.log("진행도?", data.redProgressPercent, data.blueProgressPercent);
            if (data.message && data.message === "ATTACK") {
              setTimeout(() => {
                changePercent(data);
              }, 2000);
            } else if (data.message && data.message === "MIRROR") {
              setTimeout(() => {
                changePercent(data);
              }, 3000);
            } else {
              changePercent(data);
            }
          }

          // "MAGNET(자석)" 아이템 사용
          if (data.message && data.message === "MAGNET") {
            const { targetList, redBundles, blueBundles, targets } = data;
            if (targets !== getTeam().toUpperCase()) {
              return;
            }
            const targetBundles = getTeam() === "red" ? redBundles : blueBundles;
            const setTeamSnackMessage =
              getTeam() === "red" ? setRedSnackMessage : setBlueSnackMessage;
            if (targetList.length === 0) {
              setTeamSnackMessage("운이 없게도 자석 아이템을 사용했지만 아무 효과도 없었다...");
              return;
            }
            addAudio(magnetAudioPath);
            setTeamSnackMessage("자석 아이템 사용!");
            usingItemMagnet(targetList, targetBundles);
            changeNumOfUsing(targets, true);
            return;
          }

          // "FRAME(액자)" 아이템 사용
          if (data.message && data.message === "FRAME") {
            const { targetList, redBundles, blueBundles, targets } = data;
            if (targets !== getTeam().toUpperCase()) {
              return;
            }
            const targetBundles = getTeam() === "red" ? redBundles : blueBundles;
            const setTeamSnackMessage =
              getTeam() === "red" ? setRedSnackMessage : setBlueSnackMessage;
            if (targetList.length === 0) {
              setTeamSnackMessage(
                "액자 효과를 받을 퍼즐이 하나도 없네요... 다음에는 조금 더 아껴놨다가 써보세요.",
              );
              return;
            }
            addAudio(frameAudioPath);
            if (targetList.length < 7) {
              setTeamSnackMessage("액자 아이템이 사용됐어요.");
              usingItemFrame(targetList, targetBundles);
              return;
            }
            setTeamSnackMessage("액자 효과는 굉장했다!!!");
            usingItemFrame(targetList, targetBundles);
            return;
          }

          // "HINT(힌트)" 아이템 사용
          if (data.message && data.message === "HINT") {
            const { targetList, targets } = data;
            const setTeamSnackMessage =
              targets === "RED" ? setRedSnackMessage : setBlueSnackMessage;
            if (targets === "RED") {
              redAddHint(...targetList);
            }

            if (targets === "BLUE") {
              blueAddHint(...targetList);
            }
            addAudio(hintAudioPath);
            setTeamSnackMessage("반짝이는 두 개의 인접한 퍼즐을 맞춰봐요!");
            changeNumOfUsing(targets, true);
            return;
          }

          // 우리팀 event
          if (data.message && data.team === getTeam().toUpperCase()) {
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
              const { targets, combo, comboCnt, team } = data;
              const [fromIndex, toIndex] = targets.split(",").map((piece) => Number(piece));
              addPiece({ fromIndex, toIndex });

              if (team === "RED") {
                redCleanHint({ fromIndex, toIndex });
              }

              if (team === "BLUE") {
                blueCleanHint({ fromIndex, toIndex });
              }

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
                  comboText.style.left = "40%";
                  comboText.style.top = "100px";
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
          }

          // 공격형 아이템 공격 성공
          if (data.message && data.message === "ATTACK") {
            console.log("공격메세지", data);
            // dropRandomItem 삭제
            if (dropRandomItemElement.current.parentNode) {
              dropRandomItemElement.current.parentNode.removeChild(dropRandomItemElement.current);
            }

            attackItemSwitch(data);
          }

          if (data.message && data.message === "SHIELD") {
            console.log("공격메세지 : 쉴드", data);
            // dropRandomItem 삭제
            if (dropRandomItemElement.current.parentNode) {
              dropRandomItemElement.current.parentNode.removeChild(dropRandomItemElement.current);
            }

            if (getTeam() === "red") {
              setRedSnackMessage(`🛡️와우 쉴드로 ${currentDropRandomItem.current}을 막았어요!🛡️`);
            } else {
              setBlueSnackMessage(
                `🛡️아쉽게도 상대팀의 쉴드에 ${currentDropRandomItem.current} 공격이 막혔네요...🛡️`,
              );
            }
          }

          if (data.message && data.message === "MIRROR") {
            console.log("공격메세지 : 거울", data);
            // dropRandomItem 삭제
            if (dropRandomItemElement.current.parentNode) {
              dropRandomItemElement.current.parentNode.removeChild(dropRandomItemElement.current);
            }
            attackItemSwitch(data, true);

            if (getTeam() === "red") {
              setRedSnackMessage(`거울 효과 발동!`);
            } else {
              setBlueSnackMessage(`상대팀의 거울 아이템으로 공격이 반사됐어요...`);
            }
          }

          // drop random Item 생성
          if (data.message && data.message === "DROP_ITEM" && data.randomItem) {
            // 버튼 생성
            const canvasContainer = document.getElementById("canvasContainer");
            const dropRandomItemImg = document.createElement("img");
            dropRandomItemImg.src = dropRandomItemPath;

            // 버튼의 위치 설정
            dropRandomItemImg.style.position = "absolute";
            dropRandomItemImg.style.left = data.randomItem.position_x + "px";
            dropRandomItemImg.style.top = data.randomItem.position_y + "px";
            dropRandomItemImg.style.transform = "translate(-50%, -50%)";
            dropRandomItemImg.style.cursor = "pointer";

            dropRandomItemImg.onclick = function () {
              // 부모 요소로부터 버튼 제거
              //근데 이거 다른 클라이언트들도 이 아이템 먹었다고 버튼 사라지는 이벤트 처리하든가 해야함.
              console.log("item dropRandomItemImg 클릭됨");
              canvasContainer.removeChild(dropRandomItemImg);

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

            // 버튼을 canvasContainer에 추가
            dropRandomItemElement.current = dropRandomItemImg;
            canvasContainer.appendChild(dropRandomItemImg);

            // 현재 아이템 저장 (SHIELD 효과를 위해)
            currentDropRandomItem.current =
              data.randomItem.name === "EARTHQUAKE"
                ? "회오리"
                : data.randomItem.name === "FIRE"
                  ? "불 지르기"
                  : "로켓";

            // alert 대신 메시지를 콘솔에 출력
            console.log(
              data.randomItem.name +
                " 을 " +
                data.randomItem.position_x +
                " " +
                data.randomItem.position_y +
                " 에 생성한다!",
            );

            // 3초 뒤 아이템 삭제
            setTimeout(() => {
              if (dropRandomItemImg.parentNode) {
                console.log("3초 끝남! item dropRandomItemImg 삭제");
                canvasContainer.removeChild(dropRandomItemImg);
              }
            }, 3000);
          }
        });

        // 채팅
        subscribe(`/topic/chat/room/${roomId}`, (message) => {
          const data = JSON.parse(message.body);
          console.log("채팅왔다", data);
          const { userid, chatMessage, time, teamColor } = data;
          if (teamColor === getTeam().toUpperCase()) {
            const receivedMessage = { userid, chatMessage, time }; // 받은 채팅
            setChatHistory((prevChat) => [...prevChat, receivedMessage]); // 채팅 기록에 새로운 채팅 추가
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
        // navigate(`/game/battle`, {
        //   replace: true,
        // });
      },
    );
  };

  useEffect(() => {
    if (roomId !== getRoomId() || !getSender()) {
      navigate("/game/battle", {
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

  return (
    <Wrapper>
      {!isLoaded ? (
        <Loading message="게임 정보 받아오는 중..." />
      ) : (
        <>
          <Board id="gameBoard">
            <PlayPuzzle
              category="battle"
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
              <ProgressWrapper>
                <PrograssBar percent={enemyPercent} isEnemy={true} />
              </ProgressWrapper>
            </Row>

            <Col>
              <Timer num={time} />
              <h3>이 그림을 맞춰주세요!</h3>
              <img
                src={pictureSrc}
                alt="퍼즐 그림"
                style={{ width: "100%", borderRadius: "10px", margin: "5px" }}
              />
              <Chatting chatHistory={chatHistory} isIngame={true} isBattle={true} />
            </Col>
          </Board>

          {getTeam() === "red" ? (
            <>
              <ItemInventory
                prevItemInventory={prevRedItemInventory}
                itemInventory={redItemInventory}
                onUseItem={handleUseItem}
              />
              {document.querySelector("#canvasContainer") &&
                createPortal(
                  <Hint hintList={redHintList} setHintList={setRedHintList} />,
                  document.querySelector("#canvasContainer"),
                )}
              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={isShowRedSnackbar}
                autoHideDuration={1500}
                onClose={onCloseRedSnackbar}
                message={redSnackMessage}
              />
            </>
          ) : (
            <>
              <ItemInventory
                prevItemInventory={prevBlueItemInventory}
                itemInventory={blueItemInventory}
                onUseItem={handleUseItem}
              />
              {document.querySelector("#canvasContainer") &&
                createPortal(
                  <Hint hintList={blueHintList} setHintList={setBlueHintList} />,
                  document.querySelector("#canvasContainer"),
                )}
              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={isShowBlueSnackbar}
                autoHideDuration={1500}
                onClose={onCloseBlueSnackbar}
                message={BlueSnackMessage}
              />
            </>
          )}

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={isShowSnackbar}
            autoHideDuration={3000}
            onClose={handleSnackClose}
            message={snackMessage}
          />

          {/* <ThemeProvider theme={theme}>
            <Dialog open={isOpenedDialog} onClose={handleCloseGame}>
              <DialogTitle>게임 결과</DialogTitle>
            </Dialog>
          </ThemeProvider> */}

          <ResultModal
            isOpenedDialog={isOpenedDialog}
            handleCloseGame={handleCloseGame}
            ourPercent={ourPercent}
            enemyPercent={enemyPercent}
            ourTeam={gameData[`${getTeam()}Team`].players}
            enemyTeam={getTeam() === "red" ? gameData.blueTeam.players : gameData.redTeam.players}
            numOfUsingItemRed={numOfUsingItemRed}
            numOfUsingItemBlue={numOfUsingItemBlue}
          />
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  min-height: 1000px;
  background-image: ${getTeam() === "red"
    ? `url(${redTeamBackgroundPath})`
    : `url(${blueTeamBackgroundPath})`};
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
  border: 3px solid ${getTeam() === "red" ? red[400] : blue[400]};
  background-color: rgba(255, 255, 255, 0.8);
`;

const ProgressWrapper = styled(Box)`
  margin: 0 1px;
  display: inline-block;
  transform: rotate(180deg);
`;
