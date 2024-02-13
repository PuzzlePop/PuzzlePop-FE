import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../apis/requestBuilder";
import IconButton from "@mui/material/IconButton";
import ChatIcon from "@mui/icons-material/Chat";
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function FriendSearch() {
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

    </>
  );
}

