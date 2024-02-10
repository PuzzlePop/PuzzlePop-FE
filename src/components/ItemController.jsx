import { useCallback, useEffect } from "react";
import { getRoomId, getSender } from "../socket-utils/storage";
import { socket } from "../socket-utils/socket";
import { configStore } from "../puzzle-core";

const { getConfig } = configStore;
const { send } = socket;

export default function ItemController({ itemInventory }) {
  const _useItem = useCallback((keyNumber) => {
    console.log(keyNumber);

    send(
      "/app/game/message",
      {},
      JSON.stringify({
        type: "GAME",
        roomId: getRoomId(),
        sender: getSender(),
        message: "USE_ITEM",
        targets: keyNumber,
      }),
    );
  }, []);

  const handleKeyDownItem = useCallback(
    (event) => {
      if (!event.code) {
        return;
      }
      const pressedKeyNumber = Number(event.code.replace("Digit", ""));
      if (Number.isNaN(pressedKeyNumber) || 1 > pressedKeyNumber || 5 < pressedKeyNumber) {
        return;
      }
      _useItem(pressedKeyNumber);
    },
    [_useItem],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDownItem);

    return () => {
      window.removeEventListener("keydown", handleKeyDownItem);
    };
  }, [handleKeyDownItem]);

  console.log(getConfig());

  return (
    <>
      {itemInventory.map((item, index) => (
        <button key={index} onClick={() => _useItem(index + 1)}>
          {item ? item.name : "X"}
        </button>
      ))}
    </>
  );
}
