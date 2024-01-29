import GamePageNavigation from "@/components/GamePageNavigation";
import GameRoomListBoard from "@/components/GameRoomList/GameRoomListBoard";

export default function BattleGameListPage() {
  return (
    <>
      <GamePageNavigation />
      <h1>배틀 플레이</h1>
      <GameRoomListBoard />
    </>
  );
}
