import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <h1>
      HomePage <Link to="/game">게임페이지로</Link>
    </h1>
  );
}
