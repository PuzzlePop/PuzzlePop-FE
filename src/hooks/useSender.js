import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";

const webStorage = sessionStorage;

const SenderState = atom({
  key: "SenderState",
  default: webStorage.getItem("wschat.sender"),
});

export default function useSender() {
  const [_sender, setSender] = useRecoilState(SenderState);

  useEffect(() => {
    if (!_sender || _sender === "null") {
      const sender = window.prompt("닉네임을 입력해주세요");
      if (sender) {
        setSender(sender);
        webStorage.setItem("wschat.sender", sender);
      }
    }
  }, [_sender, setSender]);

  return {
    sender: _sender,
  };
}
