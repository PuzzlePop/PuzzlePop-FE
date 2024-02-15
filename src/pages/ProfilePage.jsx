import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserAPI from "../apis/CustomUserAPI";
import RecordAPI from "../apis/CustomRecordAPI";
import { useEffect, useState } from "react";
import styled from "styled-components";
import backgroundPath from "@/assets/backgrounds/background.gif";

export default function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchNickName, setSearchNickName] = useState("");
  const [searchedUsersByEmail, setSearchedUsersByEmail] = useState([]);
  const [searchedUsersByNickName, setSearchedUsersByNickName] = useState([]);

  const searchUsersByEmail = async () => {
    // UserController 매개변수 변경 예정
    await UserAPI.searchUserByEmail(searchEmail)
      .then((response) => setSearchedUsersByEmail(response))
      .catch((error) => console.debug(error));
  };

  const searchUsersByNickName = async () => {
    // UserController 매개변수 변경 예정
    await UserAPI.searchUsersByNickName(searchNickName)
      .then((response) => setSearchedUsersByNickName(response))
      .catch((error) => console.debug(error));
  };

  useEffect(() => {
    // UserController 매개변수 변경 예정
    UserAPI.fetchUser(userId)
      .then((response) => setUser(response))
      .catch((error) => console.debug(error));

    // 302 FOUND 오류 추후 OK로 변경 예정
    UserAPI.fetchUsers()
      .then((response) => setUsers(response))
      .catch((error) => console.debug(error));
  }, [userId]);

  const [recordId, setRecordId] = useState(1);
  const [record, setRecord] = useState({});
  const [records, setRecords] = useState([]);
  const [recordInfo, setRecordInfo] = useState({});

  const getRecordById = async () => {
    // DB 데이터 없어서 현재 오류남 (RecordId = 1)
    RecordAPI.fetchRecord(recordId)
      .then((response) => setRecord(response))
      .catch((error) => console.debug(error));
  };

  useEffect(() => {
    // DB 데이터 없어서 현재 오류남 (RecordId = 1)
    // RecordAPI.fetchRecord(recordId)
    //   .then(response => setRecord(response))
    //   .catch(error => console.debug(error));
    RecordAPI.fetchRecords(userId)
      .then((response) => setRecords(response))
      .catch((error) => console.debug(error));
    RecordAPI.fetchRecordInfo(userId)
      .then((response) => setRecordInfo(response))
      .catch((error) => console.debug(error));
  }, [userId]);

  return (
    <Wrapper>
      <Header />
      <style>{`
        .box {
          width: 100%;
          height: 150px;
        }
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 20px;
        }
        .left-box {
          width: 550px;
          height: 50px;
        }
        .search-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 30px;
        }
        .search-container input[type="text"] {
          margin-right: 20px;
          padding: 20px;
          font-size: 20px;
          border-radius: 10px;
          border: 2px solid #ccc;
        }
        .search-container button {
          padding: 20px 40px;
          font-size: 20px;
          border-radius: 10px;
          border: none;
          background-color: #007bff;
          color: #fff;
          cursor: pointer;
        }
        .user-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 30px;
        }
        .user-container div {
          margin: 20px;
        }
        .user-info {
          background: white;
          padding: 40px;
          border: 2px solid #ccc;
          border-radius: 20px;
          box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
          height: 400px;
          width : 500px;
          display: flex;
          flex-direction: column;
          justify-content: center; /* 수평 가운데 정렬 */
          align-items: center; /* 수직 가운데 정렬 */
          background: rgba(255, 255, 255, 0.7);
          font-size: 24px;
            font-weight: bold;
        }
        .user-info img {
          width: 300px;
          height: auto;
        }
      `}</style>
      <div className="box"></div>
      <div className="container">
        {/* <div className="search-container">
        <div className="left-box"></div>
          <input type="text" value={searchNickName} onChange={(e) => setSearchNickName(e.target.value)} />
          <button onClick={searchUsersByNickName}>검색</button>
        </div> */}
        <div className="user-container">
          <div className="user-info">
            <img src={user.img_path} alt="User Image" />
            <div>
              {user.family_name}
              {user.given_name}
            </div>
          </div>
          <div className="user-info">
            <div>닉네임 : {user.nickname}</div>
            <div>email: {user.email}</div>
            <div>국적 : {user.locale}</div>
            {/* <div>상태 : {user.online_status}</div> */}
            {/* <div>보유 골드 : {user.gold}</div> */}
          </div>
        </div>
      </div>

      {/* <hr />
      <h2>Search UserInfo by email = {searchEmail}</h2>
      검색할 이메일: 
      <input type="text" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} />
      <button onClick={searchUsersByEmail}>검색</button>
      {searchedUsersByEmail.map((user, index) => (
        <div key={index}>
          <div>user.id: {user.id}</div>
          <div>user.email: {user.email}</div>
          <div>user.nickname: {user.nickname}</div>
          <div>user.givenName: {user.givenName}</div>
          <div>user.familyName: {user.familyName}</div>
          <div>user.imgPath: {user.imgPath}</div>
          <div>user.locale: {user.locale}</div>
          <div>user.onlineStatus: {user.onlineStatus}</div>
        </div>
      ))}

      <hr />
      
      {searchedUsersByNickName.map((user, index) => (
        <div key={index}>
          <div>user.id: {user.id}</div>
          <div>user.email: {user.email}</div>
          <div>user.nickname: {user.nickname}</div>
          <div>user.givenName: {user.givenName}</div>
          <div>user.familyName: {user.familyName}</div>
          <div>user.imgPath: {user.imgPath}</div>
          <div>user.locale: {user.locale}</div>
          <div>user.onlineStatus: {user.onlineStatus}</div>
        </div>
      ))}

      <hr />
      <h2>Record below by recordId = {recordId}</h2>
      검색할 기록 id: 
      <input type="number" value={recordId} onChange={(e) => setRecordId(e.target.value)} />
      <button onClick={getRecordById}>검색</button>
      <div>Record.id: {record.id}</div>
      <div>Record.userId: {record.userId}</div>
      <div>Record.gameId: {record.gameId}</div>

      <hr />
      <h2>Records below by UserId = {userId}</h2>
      {records.map((record, index) => (
        <div key={index}>
          <div>Record.GameInfo.id: {record.gameInfo.id}</div>
          <div>Record.GameInfo.type: {record.gameInfo.type}</div>
          <div>Record.GameInfo.isCleared: {record.gameInfo.isCleared}</div>
          <div>Record.GameInfo.curPlayerCount: {record.gameInfo.curPlayerCount}</div>
          <div>Record.GameInfo.maxPlayerCount: {record.gameInfo.maxPlayerCount}</div>
          <div>Record.GameInfo.totalPieceCount: {record.gameInfo.totalPieceCount}</div>
          <div>Record.GameInfo.limitTime: {record.gameInfo.limitTime}</div>
          <div>Record.GameInfo.passedTime: {record.gameInfo.passedTime}</div>
          <div>Record.GameInfo.startedTime: {record.gameInfo.startedTime}</div>
          <div>Record.GameInfo.finishedTime: {record.gameInfo.finishedTime}</div>
          {record.teamList.map((team, index) => (
            <div key={index}>
              <div>Record.TeamList[{index}].id: {team.id}</div>
              <div>Record.TeamList[{index}].gameId: {team.gameId}</div>
              <div>Record.TeamList[{index}].matchedPieceCount: {team.matchedPieceCount}</div>
            </div>              
          ))}
          {record.userTeamList1.map((team, index) => (
            <div key={index}>
              <div>Record.userTeamList1[{index}].id: {team.id}</div>
              <div>Record.userTeamList1[{index}].team.id: {team.team.id}</div>
              <div>Record.userTeamList1[{index}].team.gameId: {team.team.gameId}</div>
              <div>Record.userTeamList1[{index}].team.matchedPieceCount: {team.team.matchedPieceCount}</div>
              <div>Record.userTeamList1[{index}].user.id: {team.user.id}</div>
              <div>Record.userTeamList1[{index}].user.email: {team.user.email}</div>
              <div>Record.userTeamList1[{index}].user.nickname: {team.user.nickname}</div>
              <div>Record.userTeamList1[{index}].user.givenName: {team.user.givenName}</div>
              <div>Record.userTeamList1[{index}].user.familyName: {team.user.familyName}</div>
              <div>Record.userTeamList1[{index}].user.imgPath: {team.user.imgPath}</div>
              <div>Record.userTeamList1[{index}].user.locale: {team.user.locale}</div>
              <div>Record.userTeamList1[{index}].user.playingGameID: {team.user.playingGameID}</div>
              <div>Record.userTeamList1[{index}].user.onlineStatus: {team.user.onlineStatus}</div>
              <div>Record.userTeamList1[{index}].matchedPieceCount: {team.matchedPieceCount}</div>
            </div>              
          ))}
          {record.userTeamList2.map((team, index) => (
            <div key={index}>
              <div>Record.userTeamList2[{index}].id: {team.id}</div>
              <div>Record.userTeamList2[{index}].team.id: {team.team.id}</div>
              <div>Record.userTeamList2[{index}].team.gameId: {team.team.gameId}</div>
              <div>Record.userTeamList2[{index}].team.matchedPieceCount: {team.team.matchedPieceCount}</div>
              <div>Record.userTeamList2[{index}].user.id: {team.user.id}</div>
              <div>Record.userTeamList2[{index}].user.email: {team.user.email}</div>
              <div>Record.userTeamList2[{index}].user.nickname: {team.user.nickname}</div>
              <div>Record.userTeamList2[{index}].user.givenName: {team.user.givenName}</div>
              <div>Record.userTeamList2[{index}].user.familyName: {team.user.familyName}</div>
              <div>Record.userTeamList2[{index}].user.imgPath: {team.user.imgPath}</div>
              <div>Record.userTeamList2[{index}].user.locale: {team.user.locale}</div>
              <div>Record.userTeamList2[{index}].user.playingGameID: {team.user.playingGameID}</div>
              <div>Record.userTeamList2[{index}].user.onlineStatus: {team.user.onlineStatus}</div>
              <div>Record.userTeamList2[{index}].matchedPieceCount: {team.matchedPieceCount}</div>
            </div>              
          ))}
        </div>
      ))}

      <hr />
      <h2>RecordInfo below by UserId = {userId}</h2>
      <div>user_id: {recordInfo.user_id}</div>
      <div>win_count: {recordInfo.win_count}</div>
      <div>total_matched_piece_count: {recordInfo.total_matched_piece_count}</div>
      <div>played_battle_game_count: {recordInfo.played_battle_game_count}</div>
      <div>played_game_count: {recordInfo.played_game_count}</div> */}
      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 1000px;
  background-image: url(${backgroundPath});
`;
