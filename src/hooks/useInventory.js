import { useState } from "react";

const defaultValue = [null, null, null, null, null];

export const useInventory = () => {
  const [itemInventory, setItemInventory] = useState(defaultValue);

  return {
    itemInventory,
    setItemInventory,
  };
};
