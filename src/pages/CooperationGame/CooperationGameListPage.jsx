import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GamePageNavigation from "../../components/GamePageNavigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { request } from "../../apis/requestBuilder";
import GameRoomListBoard from "@/components/GameRoomList/GameRoomListBoard";
import { Modal, Typography, Box, TextField, Button } from "@mui/material";
import { setRoomId, setSender } from "../../socket-utils/storage";

export default function CooperationGameListPage() {
  const navigate = useNavigate();
  const [roomList, setRoomList] = useState([]);
  const [roomTitle, setRoomTitle] = useState("");
  const [roomSize, setRoomSize] = useState(2);
  const [isOpenedModal, setIsOpenedModal] = useState(false);

  const handleRoomSize = (e) => {
    const count = Number(e.target.value);
    if (2 <= count && count <= 6) {
      setRoomSize(count);
    }
  };

  const enterRoom = async (roomId) => {
    const sender = window.prompt("닉네임을 입력해주세요");
    if (!sender) {
      return;
    }
    setSender(sender);
    setRoomId(roomId);
    navigate(`/game/cooperation/${roomId}`);
  };

  const createRoom = async () => {
    if (!roomTitle) {
      return;
    }

    const sender = window.prompt("닉네임을 입력해주세요");
    if (!sender) {
      return;
    }
    setSender(sender);

    const { data } = await request.post("/game/room", {
      name: roomTitle,
      userid: sender,
      type: "TEAM",
      roomSize,
      gameType: "COOPERATION",
    });
    // 방 속성 정보
    const { blueTeam, gameId, gameName, gameType, isStarted, redTeam, sessionToUser, startTime } =
      data;
    setRoomId(gameId);
    navigate(`/game/cooperation/${gameId}`);
  };

  const findAllRoom = async () => {
    const res = await request.get("/game/rooms");
    const { data: fetchedRoomList } = res;
    setRoomList(fetchedRoomList);
  };

  useEffect(() => {
    findAllRoom();
  }, []);

  return (
    <>
      <Header />
      <GamePageNavigation />
      <button onClick={() => setIsOpenedModal(true)}>방 만들기</button>
      <ul>
        {roomList.map((room) => (
          <div key={room.gameId} onClick={() => enterRoom(room.gameId)}>
            {room.gameName}
          </div>
        ))}
      </ul>
      {/* <GameRoomListBoard category="cooperation" /> */}
      <Modal
        open={isOpenedModal}
        onClose={() => setIsOpenedModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h4" component="h2">
            협동방 만들기
          </Typography>
          <Box id="modal-modal-description" sx={{ mt: 2 }}>
            <input
              placeholder="방 제목"
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
            />
            <input type="number" value={roomSize} onChange={handleRoomSize} />
            <button disabled={!roomTitle} onClick={createRoom}>
              방 만들기
            </button>
          </Box>
        </Box>
      </Modal>

      <Footer />
    </>
  );
}
