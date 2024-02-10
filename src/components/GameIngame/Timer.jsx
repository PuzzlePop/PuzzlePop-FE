import { useState, useEffect } from "react";

export default function Timer({ num }) {
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);

  useEffect(() => {
    setMin(Math.floor(num / 60));
    const tempSec = num % 60;

    if (tempSec <= 9) {
      setSec("0" + tempSec);
    } else {
      setSec(tempSec);
    }
  }, [num]);

  return (
    <>
      <h1>
        {min} : {sec}
      </h1>
    </>
  );
}
