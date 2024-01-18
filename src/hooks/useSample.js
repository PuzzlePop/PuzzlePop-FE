import { useState } from "react";

export const useSample = (defaultCount = 0) => {
  const [count, setCount] = useState(defaultCount);

  const increase = () => {
    setCount((prev) => prev + 1);
  };

  const decrease = () => {
    setCount((prev) => prev - 1);
  };

  return {
    count,
    increase,
    decrease,
  };
};
