import GamePageNavigation from "@/components/GamePageNavigation";
import GameRoomListBoard from "@/components/GameRoomList/GameRoomListBoard";
import Header from "../../components/Header";

export default function BattleGameListPage() {
  return (
    <>
      <Header />
      <GamePageNavigation />
      <div style={{ width: "950px", margin: "5% auto" }}>
        <h1>배틀 플레이</h1>
      </div>
      <GameRoomListBoard category="battle" />
    </>
  );
}

// const Wrapper = styled.div`
//   background-image: url("https://pressstart.vip/images/uploads/assets/cityskyline.png");
// `;
