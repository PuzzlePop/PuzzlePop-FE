import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { request } from "../../apis/requestBuilder";
import IconButton from "@mui/material/IconButton";
import ChatIcon from "@mui/icons-material/Chat";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";

export default function FriendList() {
  const navigate = useNavigate();
  // const request_status = "accepted";
  const [friendList, setFriendList] = useState([]);

  const fetchFriendList = async (userId) => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }
    const response = await request.post(`/friend/list/accepted`, { id: userId }); // TODO: 현재 로그인 중인 사용자 ID로 교체할 것
    const { data: friendList } = response;

    console.log(friendList);
    setFriendList(friendList);
  };

  useEffect(() => {
    fetchFriendList(getCookie("userId"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        return cookie.substring(name.length + 1);
      }
    }
  };

  const FriendCard = ({ item }) => {
    return (
      <StyledFriendCard>
        <ProfileImage imgPath={item.friend_user_info.img_path} />
        <UserInfo>
          <div>
            {item.friend_user_info.family_name}
            {item.friend_user_info.given_name}
          </div>
        </UserInfo>
        <IconWrapper>
          {/* <IconButton aria-label="dmBtn" onClick={() => navigate(`/dm/${item.friend_id}`)}>
            <ChatIcon />
          </IconButton> */}
          <IconButton
            aria-label="profileBtn"
            onClick={() => navigate(`/user/${item.friend_user_info.id}`)}
          >
            <ContactEmergencyIcon />
          </IconButton>
        </IconWrapper>
      </StyledFriendCard>
    );
  };

  return (
    <>
      {friendList.map((friend) => (
        <FriendCard key={friend.friend_id} item={friend} />
      ))}
    </>
  );
}

const StyledFriendCard = styled.div`
  display: flex;
  justify-content: space-between; /* 내부의 자식 요소들을 양쪽 끝으로 정렬 */
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 옅은 그림자 */
`;

const UserInfo = styled.div`
  margin-left: 10px;
`;

const IconWrapper = styled.div`
  display: flex;
`;

const ProfileImage = ({ imgPath }) => {
  return <StyledImage src={imgPath} alt="Profile" />;
};

const StyledImage = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
`;
