import { useParams } from "react-router-dom";

export default function CooperationGameWaitingPage() {
  const { roomId } = useParams();

  return (
    <>
      <h1>CooperationGameWaitingPage</h1>
      <div>roomId : {roomId}</div>
    </>
  );
}
