import { useEffect, useState } from "react";
import { request } from "../../apis/requestBuilder";

export default function FetchDataComponent() {
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
        <div key={item.id} style={{ border: '3px solid #010', margin: '10px', padding: '20px' }}>
            {/* <img src={item.img_path}></img> */}
            <div>nickname: {item.nickname}</div>
            <div>status: {item.online_status}</div>
            <div>playing game id: {item.playing_game_id}</div>
        </div>
      ))}
    </>
  );
}