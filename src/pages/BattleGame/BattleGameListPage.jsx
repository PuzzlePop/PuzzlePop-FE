import GamePageNavigation from "@/components/GamePageNavigation";
import GameRoomListBoard from "@/components/GameRoomList/GameRoomListBoard";

export default function BattleGameListPage() {
  return (
    <div>
      <GamePageNavigation />
      <div style={{ width: "950px", margin: "5% auto" }}>
        <h1>배틀 플레이</h1>
      </div>
      <GameRoomListBoard category="battle" />
    </div>
  );
}

// const Wrapper = styled.div`
//   background-image: url("https://pressstart.vip/images/uploads/assets/cityskyline.png");
// `;
