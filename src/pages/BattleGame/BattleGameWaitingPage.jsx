import GamePageNavigation from "@/components/GamePageNavigation";
import GameWaitingBoard from "@/components/GameWaiting/GameWaitingBoard";

// 더미 데이터
const dummyData = {
  roomId: 1,
  img: "https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/cnoC/image/R7FVHsxQscWuMqj6TtNhHLSH8do",
  title: "방 제목입니다.",
  isPlaying: false,
  totalPieceCount: 300,
  curPlayerCount: 3,
  maxPlayerCount: 4,
  player: [
    {
      nickname: "용상윤",
      isCaptain: true,
      isReady: true,
      isRedTeam: true,
    },
    {
      nickname: "김다인",
      isCaptain: false,
      isReady: false,
      isRedTeam: true,
    },
    {
      nickname: "김한중",
      isCaptain: false,
      isReady: false,
      isRedTeam: false,
    },
    {
      nickname: "나해란",
      isCaptain: false,
      isReady: true,
      isRedTeam: false,
    },
    {
      nickname: "이주연",
      isCaptain: false,
      isReady: false,
      isRedTeam: false,
    },
    {
      nickname: "조시훈",
      isCaptain: false,
      isReady: true,
      isRedTeam: true,
    },
  ],
};
const allowedPiece = [100, 200, 300, 400, 500];

export default function BattleGameWaitingPage() {
  return (
    <>
      <GamePageNavigation />
      <GameWaitingBoard data={dummyData} allowedPiece={allowedPiece} />
    </>
  );
}
