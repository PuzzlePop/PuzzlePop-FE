import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../apis/requestBuilder";

export default function FriendList() {
  const navigate = useNavigate();
  const [friendList, setFriendList] = useState([]);

  const fetchFriendList = async () => {
    const response = await request.post("/friend/list/accepted", { id: 1 }); // TODO: 현재 로그인 중인 사용자 ID로 교체할 것
    const { data: friendList } = response;

    console.log(friendList);
    setFriendList(friendList);
  };

  useEffect(() => {
    fetchFriendList();
  }, []);

  return (
    <>
      {friendList.map((item) => (
        <div key={item.friend_id} style={{ border: "3px solid #010", margin: "10px", padding: "20px" }}>
          {/* <img src={item.friend_user_info.img_path}></img> */}
          <div>id: {item.friend_user_info.id}</div>
          <div>nickname: {item.friend_user_info.nickname}</div>
          <div>status: {item.friend_user_info.online_status}</div>
          <div>playing game id: {item.friend_user_info.playing_game_id}</div>
          <div>
            <button onClick={() => navigate(`/dm/${item.friend_id}`)}>DM</button>
          </div>
        </div>
      ))}
    </>
  );
}
