import { Route, Routes as ReactRouterRoutes } from "react-router-dom";
import HomePage from "./HomePage";
// import { SingleGame } from "./SingleGame";
import { CooperationGame } from "./CooperationGame";
import { BattleGame } from "./BattleGame";
import RankPage from "./RankPage";
// import ShopPage from "./ShopPage";
// import OptionsPage from "./OptionsPage";
import ProfilePage from "./ProfilePage";

export function Routes() {
  return (
    <ReactRouterRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="/rank" element={<RankPage />} />
      {/* <Route path="/shop" element={<ShopPage />} /> */}
      {/* <Route path="/options" element={<OptionsPage />} /> */}
      <Route path="/user/:userId" element={<ProfilePage />} />
      <Route path="/game" element={<CooperationGame.ListPage />} />
      {/* <Route path="/game/single" element={<SingleGame.ListPage />} />
      <Route path="/game/single/:puzzleId" element={<SingleGame.IngamePage />} /> */}
      <Route path="/game/cooperation" element={<CooperationGame.ListPage />} />
      <Route path="/game/cooperation/waiting/:roomId" element={<CooperationGame.WaitingPage />} />
      <Route path="/game/cooperation/ingame/:roomId" element={<CooperationGame.IngamePage />} />
      <Route path="/game/battle" element={<BattleGame.ListPage />} />
      <Route path="/game/battle/waiting/:roomId" element={<BattleGame.WaitingPage />} />
      <Route path="/game/battle/ingame/:roomId" element={<BattleGame.IngamePage />} />
    </ReactRouterRoutes>
  );
}
