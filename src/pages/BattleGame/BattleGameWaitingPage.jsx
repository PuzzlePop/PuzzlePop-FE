import GamePageNavigation from "@/components/GamePageNavigation";
import GameWaitingBoard from "@/components/GameWaiting/GameWaitingBoard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// 더미 데이터
const dummyData = {
  roomId: 1,
  img: "https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/cnoC/image/R7FVHsxQscWuMqj6TtNhHLSH8do",
  title: "방 제목입니다.",
  isPlaying: false,
  totalPieceCount: 300,
  curPlayerCount: 4,
  maxPlayerCount: 6,
  player: [
    {
      nickname: "용상윤",
      img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      isCaptain: true,
      isReady: true,
      isRedTeam: true,
    },
    {
      nickname: "김다인",
      img: "https://ynoblesse.com/wp-content/uploads/2023/07/358520758_1425769678257003_8801872512201663407_n.jpg",
      isCaptain: false,
      isReady: false,
      isRedTeam: true,
    },
    {
      nickname: "김한중",
      img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      isCaptain: false,
      isReady: false,
      isRedTeam: false,
    },
    {
      nickname: "나해란",
      img: "https://mblogthumb-phinf.pstatic.net/MjAxODEwMjdfMjU0/MDAxNTQwNjQyMDcyMTA2.SLn2XYr5LVkefNG7EPLp56ce2WOnuy3UCCusjOyk-RUg.bs6Ir-_Dc1vfZTriBlJInV4St1UT-r2ssP0rfX3g_bYg.JPEG.dltnwjd49/444.jpg?type=w800",
      isCaptain: false,
      isReady: true,
      isRedTeam: false,
    },
  ],
};
const allowedPiece = [100, 200, 300, 400, 500];

export default function BattleGameWaitingPage() {
  return (
    <>
      <Header />
      {/* <GamePageNavigation /> */}
      <GameWaitingBoard data={dummyData} allowedPiece={allowedPiece} category="battle" />
      <Footer />
    </>
  );
}
