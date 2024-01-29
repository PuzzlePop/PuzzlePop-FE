import { useParams } from "react-router-dom";
import Header from "../components/Header";

export default function ProfilePage() {
  const { userId } = useParams();

  return (
    <>
      <Header />
      <h3>{userId} ProfilePage</h3>
    </>
  );
}
