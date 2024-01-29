import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // TODO: Link 를 Icon으로 바꿔야한다.
  return (
    <>
      <Link to="/game">게임 페이지로</Link>
      <Link to="/rank">랭킹 페이지로</Link>
      <Link to="/shop">상점 페이지로</Link>
      {isLoggedIn ? <Link to="/user/1">프로필 페이지로</Link> : <Link to="/">로그인</Link>}
    </>
  );
}
