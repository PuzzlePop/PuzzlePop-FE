import { useCallback, useState } from "react";
import { match } from "../_lib/utils";

const defaultValue = [null, null, null, null, null];

export const useInventory = () => {
  const [prevItemInventory, setPrevItemInventory] = useState(defaultValue);
  const [itemInventory, setItemInventory] = useState(defaultValue);

  const updateInventory = useCallback(
    (nextItemList) => {
      setPrevItemInventory([...itemInventory]);
      setItemInventory(
        nextItemList.map((item) => {
          if (item) {
            return {
              itemName: item.name,
              koreanName: matchItemNameToKorean(item.name),
              imageName: `item_${item.name.toLowerCase()}.png`,
            };
          }
          return null;
        }),
      );
    },
    [itemInventory],
  );

  return {
    prevItemInventory,
    itemInventory,
    updateInventory,
  };
};

const itemNameToKoreanMatcher = {
  MAGNET: "자석",
  HINT: "힌트",
  FRAME: "액자",
  SHIELD: "쉴드",
  MIRROR: "거울",
};

const matchItemNameToKorean = match(itemNameToKoreanMatcher);
