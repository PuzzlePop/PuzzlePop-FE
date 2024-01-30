import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const webStorage = sessionStorage;
const SENDER_KEY = "wschat.sender";

export default function useSender() {
  const location = useLocation();

  useEffect(() => {
    const existingSender = webStorage.getItem(SENDER_KEY);
    if (existingSender) {
      return;
    }
    const sender = window.prompt("닉네임을 입력해주세요");
    if (sender) {
      webStorage.setItem(SENDER_KEY, sender);
    }
  }, [location.pathname]);
}

export const getSender = () => webStorage.getItem(SENDER_KEY);
