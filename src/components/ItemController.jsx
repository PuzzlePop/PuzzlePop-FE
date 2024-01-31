import { useCallback, useEffect } from "react";

export default function ItemController() {
  const handleClick1 = () => {
    console.log("1번키 누름");
  };

  const handleClick2 = () => {
    console.log("2번키 누름");
  };

  const handleClick3 = () => {
    console.log("3번키 누름");
  };

  const handleClick4 = () => {
    console.log("4번키 누름");
  };

  const handleClick5 = () => {
    console.log("5번키 누름");
  };

  const handleOnKeydown = useCallback((e) => {
    if (e.code === "Digit1") {
      handleClick1();
      return;
    }

    if (e.code === "Digit2") {
      handleClick2();
      return;
    }

    if (e.code === "Digit3") {
      handleClick3();
      return;
    }

    if (e.code === "Digit4") {
      handleClick4();
      return;
    }

    if (e.code === "Digit5") {
      handleClick5();
      return;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleOnKeydown);

    return () => {
      window.removeEventListener("keydown", handleOnKeydown);
    };
  }, [handleOnKeydown]);

  return (
    <>
      <button onClick={handleClick1}>1</button>
      <button onClick={handleClick2}>2</button>
      <button onClick={handleClick3}>3</button>
      <button onClick={handleClick4}>4</button>
      <button onClick={handleClick5}>5</button>
    </>
  );
}
