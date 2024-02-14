import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { request } from "../../apis/requestBuilder";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ChatIcon from "@mui/icons-material/Chat";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TextField from "@mui/material/TextField";
import UserAPI from "../../apis/CustomUserAPI";
import { Stack, List, ListItem, ListItemText } from "@mui/material";

export default function FriendSearch() {
  const navigate = useNavigate();
  const [searchResultList, setSearchResultList] = useState([]);
  const [searchString, setSearchString] = useState("");

  const fetchSearchResultList = async () => {
    try {
      const searchList = await UserAPI.searchUsersByNickName(searchString);
      setSearchResultList(searchList);
    } catch (error) {
      console.error(error);
    }
  };

  const getCookie = (name) => {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
  };

  const sendFriendRequest = async (toUser) => {
    console.log(toUser);
    const response = await request.post(`/friend`, {
      from_user_id: getCookie("userId"),// 쿠키에서 꺼낸 userId
      to_user_id: toUser.id, // 넘어온 userId
      request_status: "requested"
    });
    console.log(response.data);
    if(response.data) {
      alert("친구 요청 완료!");
    } else {
      alert("친구 요청에 실패했습니다.");
    }

  };

  const handleSearchInputChange = (e) => {
    setSearchString(e.target.value);
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchSearchResultList();
    }
  };

  return (
    <>
      <Stack direction="row" spacing={2}>
        <TextField
          id="userSearchInput"
          value={searchString}
          onKeyDown={handleEnterKeyPress}
          onChange={handleSearchInputChange}
          label="검색할 닉네임을 입력하세요."
          variant="standard"
        />
        <Button variant="outlined" onClick={fetchSearchResultList}>
          SEARCH
        </Button>
      </Stack>
      {searchResultList.length === 0 ? (
        <p>퍼즐을 함께 즐길 플레이어를 찾아 보세요!</p>
      ) : (
        <List>
          {searchResultList.map((user) => (
            <ListItem key={user.id}>
              <ProfileImage imgPath={user.img_path} />
              <ListItemText primary={user.nickname} secondary={user.email} />

              <IconButton aria-label="profileBtn" onClick={() => navigate(`/user/${user.id}`)}>
                <ContactEmergencyIcon />
              </IconButton>
              <IconButton aria-label="friendRequestBtn" onClick={() => sendFriendRequest(user)}>
                <PersonAddIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
}

const ProfileImage = ({ imgPath }) => {
  return <StyledImage src={imgPath} alt="Profile" />;
};

const StyledImage = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin: 15px;
`;
