const webStorage = sessionStorage;

const SENDER_KEY = "wschat.sender";
const TEAM_KEY = "wschat.team";
const ROOM_KEY = "wschat.roomId";

export const getSender = () => {
  return webStorage.getItem(SENDER_KEY) || null;
};
export const setSender = (value) => {
  webStorage.setItem(SENDER_KEY, value);
};

export const getTeam = () => {
  return webStorage.getItem(TEAM_KEY) || null;
};
export const setTeam = (value) => {
  webStorage.setItem(TEAM_KEY, value);
};

export const getRoomId = () => {
  return webStorage.getItem(ROOM_KEY);
};
export const setRoomId = (value) => {
  webStorage.setItem(ROOM_KEY, value);
};
