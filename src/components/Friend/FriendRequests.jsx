import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { request } from "../../apis/requestBuilder";
import IconButton from "@mui/material/IconButton";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

export default function FriendRequests() {
  const navigate = useNavigate();
  //   const request_status = "requested";
  const [friendRequestList, setFriendRequestList] = useState([]);

  const fetchFriendRequestList = async (userId) => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }
    const response = await request.post(`/friend/list/requested`, { id: userId }); // TODO: 현재 로그인 중인 사용자 ID로 교체할 것
    const { data: friendRequestList } = response;

    console.log(friendRequestList);
    setFriendRequestList(friendRequestList);
  };

  const updateRequestStatus = async ({ item, status }) => {
    const response = await request.post(`/friend/respond`, {
      friend_id: item.friend_id,
      respond_status: status,
    });
    const { data: updatedData } = response;

    if (updatedData) {
      alert("처리 완료!");
    }

    fetchFriendRequestList(getCookie("userId"));
  };

  useEffect(() => {
    fetchFriendRequestList(getCookie("userId"));
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

  const FriendRequestCard = ({ item }) => {
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
          <IconButton
            aria-label="profileBtn"
            onClick={() => navigate(`/user/${item.friend_user_info.id}`)}
          >
            <ContactEmergencyIcon />
          </IconButton>
          <IconButton
            aria-label="acceptBtn"
            onClick={() => updateRequestStatus({ item, status: "accepted" })}
          >
            <TaskAltIcon color="success" />
          </IconButton>
          <IconButton
            aria-label="refuseBtn"
            onClick={() => updateRequestStatus({ item, status: "refused" })}
          >
            <HighlightOffIcon />
          </IconButton>
        </IconWrapper>
      </StyledFriendCard>
    );
  };

  return (
    <>
      {friendRequestList.map((friend) => (
        <FriendRequestCard key={friend.friend_id} item={friend} />
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
