import { useCallback, useEffect } from "react";
import styled from "styled-components";
import Draggable from "react-draggable";

const defaultItemInventory = [null, null, null, null, null];

export default function ItemController({
  itemInventory = [...defaultItemInventory],
  onSendUseItemMessage,
}) {
  const _useItem = useCallback(
    (keyNumber) => {
      console.log(`<ItemController /> : ${keyNumber} 키 누름!!!`);

      if (itemInventory[keyNumber - 1] !== null && onSendUseItemMessage) {
        onSendUseItemMessage(keyNumber);
      }
    },
    [onSendUseItemMessage, itemInventory],
  );

  // 1, 2, 3, 4, 5 키에 아이템사용
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

  return (
    <Draggable defaultPosition={{ x: 50, y: -1400 }}>
      <Container>
        <h3>인벤토리</h3>
        <ItemSpaces>
          {itemInventory.map((item, index) => (
            <ItemSpace key={index}>
              <ItemButton onClick={() => _useItem(index + 1)}>
                <div>{item ? item.name : "비어있음"}</div>
              </ItemButton>
              <div>{index + 1}</div>
            </ItemSpace>
          ))}
        </ItemSpaces>
      </Container>
    </Draggable>
  );
}

const Container = styled.div`
  max-width: 300px;
  z-index: 9999;
  background-color: #b67352;
  padding: 10px;
  border: 3px solid #965e43;
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  text-align: center;
  font-weight: 800;

  color: white;

  cursor: grab;

  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

const ItemSpaces = styled.ul`
  display: flex;
`;

const ItemSpace = styled.div`
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 3px;

  font-size: 18px;
  font-weight: 800;
`;

const ItemButton = styled.button`
  width: 100%;
  cursor: pointer;

  font-size: 18px; // TODO: 여기에 Text 대신 이미지를 넣자
`;
