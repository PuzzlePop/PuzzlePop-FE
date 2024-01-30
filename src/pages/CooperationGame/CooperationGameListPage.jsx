import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GamePageNavigation from "../../components/GamePageNavigation";
import Header from "../../components/Header";
import { request } from "../../apis/requestBuilder";
import GameRoomListBoard from "@/components/GameRoomList/GameRoomListBoard";
import { Modal, Typography, Box } from "@mui/material";

const USER_ID = "1"; // sample

export default function CooperationGameListPage() {
  const navigate = useNavigate();
  const [roomList, setRoomList] = useState([]);
  const [roomTitle, setRoomTitle] = useState("");
  const [roomCount, setRoomCount] = useState(1);
  const [isOpenedModal, setIsOpenedModal] = useState(false);

  const handleRoomCount = (e) => {
    const count = Number(e.target.value);
    if (1 <= count && count <= 6) {
      setRoomCount(count);
    }
  };

  const enterRoom = async (roomId) => {
    const sender = window.prompt("닉네임을 입력해주세요");
    if (sender) {
      localStorage.setItem("wschat.sender", sender);
      localStorage.setItem("wschat.roomId", roomId);
      navigate(`/game/cooperation/${roomId}`);
    }
  };

  const createRoom = async () => {
    if (!roomTitle) {
      return;
    }

    const res = await request.post("/game/room", {
      name: roomTitle,
      userid: USER_ID,
      type: "TEAM",
    });
    const { gameId, gameName, gameType, admin, redTeam, blueTeam, isStarted } = res;
    console.log(res);
    setRoomTitle("");
    await findAllRoom();
  };

  const findAllRoom = async () => {
    const res = await request.get("/game/rooms");
    const { data } = res;
    setRoomList(data);
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
        {roomList.map((room, index) => (
          <div key={index} onClick={() => enterRoom(room.gameId)}>
            {room.gameName}
          </div>
        ))}
      </ul>
      <GameRoomListBoard category="cooperation" />
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
            <input type="number" value={roomCount} onChange={handleRoomCount} />
            <button disabled={!roomTitle} onClick={createRoom}>
              방 만들기
            </button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
