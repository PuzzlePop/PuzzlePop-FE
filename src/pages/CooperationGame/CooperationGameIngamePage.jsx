import { useParams } from "react-router-dom";
import PlayPuzzle from "../../components/PlayPuzzle";

export default function CooperationGameIngamePage() {
  const { roomId } = useParams();

  return (
    <>
      <h1>CooperationGameIngamePage : {roomId}</h1>
      <PlayPuzzle shapes={null} />
    </>
  );
}
