import styled from "styled-components";
import GamePageNavigation from "@/components/GamePageNavigation";
import GameRoomListBoard from "@/components/GameRoomList/GameRoomListBoard";

export default function BattleGameListPage() {
  return (
    <div>
      <GamePageNavigation />
      <Header>
        <h1>배틀 플레이</h1>
      </Header>
      <GameRoomListBoard category="battle" />
    </div>
  );
}

const Header = styled.div`
  width: 80%;
  margin: 5% auto;
`;

// const Wrapper = styled.div`
//   background-image: url("https://pressstart.vip/images/uploads/assets/cityskyline.png");
// `;
