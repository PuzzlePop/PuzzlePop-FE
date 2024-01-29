import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function HomePage() {
  return (
    <>
      <Header />
      <h3>
        HomePage <Link to="/game">게임페이지로</Link>
      </h3>
    </>
  );
}
