import { useCallback, useEffect } from "react";
import styled from "styled-components";
import Draggable from "react-draggable";
import { match } from "../_lib/utils";
import frameImage from "@/assets/inventory-items/item_frame.png";
import hintImage from "@/assets/inventory-items/item_hint.png";
import magnetImage from "@/assets/inventory-items/item_magnet.png";
import mirrorImage from "@/assets/inventory-items/item_mirror.png";
import shieldImage from "@/assets/inventory-items/item_shield.png";

export default function ItemInventory({ prevItemInventory, itemInventory, onUseItem }) {
  const _useItem = useCallback(
    (keyNumber) => {
      if (itemInventory[keyNumber - 1] && onUseItem) {
        onUseItem(keyNumber);
      }
    },
    [onUseItem, itemInventory],
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

  // TODO: 이전에 있던 배열과 비교해서 새로운 아이템이 들어온 경우 이펙트를 줘야한다.
  // 다른 인덱스..

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDownItem);

    console.log("이벤트 어태치!");

    return () => {
      window.removeEventListener("keydown", handleKeyDownItem);
    };
  }, [handleKeyDownItem]);

  useEffect(() => {
    console.log(prevItemInventory, itemInventory);
  }, [prevItemInventory, itemInventory]);

  return (
    <Draggable defaultPosition={{ x: 20, y: -800 }}>
      <Container>
        <h3>인벤토리</h3>
        <ItemSpaces>
          {itemInventory.map((item, index) => (
            <ItemSpace key={index}>
              {item ? (
                <Item
                  onClick={() => _useItem(index + 1)}
                  src={getImageSource(item.itemName)}
                  alt={item.itemName}
                />
              ) : (
                <EmptyItem alt="빈 아이템" />
              )}
              <div>{index + 1}</div>
            </ItemSpace>
          ))}
        </ItemSpaces>
      </Container>
    </Draggable>
  );
}

const imageMatcher = {
  FRAME: frameImage,
  HINT: hintImage,
  MAGNET: magnetImage,
  MIRROR: mirrorImage,
  SHIELD: shieldImage,
};

const getImageSource = match(imageMatcher);

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
  justify-content: center;
  align-items: center;
`;

const ItemSpace = styled.div`
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3px;

  font-size: 18px;
  font-weight: 800;
`;

const Item = styled.img`
  display: block;
  width: 50px;
  height: 50px;
  cursor: pointer;
  object-fit: contain;
`;

const EmptyItem = styled.div`
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f2f2f2;
  opacity: 0.5;
  pointer-events: none;
`;
