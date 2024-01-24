import { Link } from "react-router-dom";

export default function GamePageNavigation() {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <Link to="/game/single">싱글</Link>
      <Link to="/game/cooperation">협동</Link>
      <Link to="/game/battle">배틀</Link>
    </div>
  );
}
