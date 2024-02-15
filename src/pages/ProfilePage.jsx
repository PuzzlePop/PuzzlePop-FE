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
  const [recordId, setRecordId] = useState(1);
  const [record, setRecord] = useState({});
  const [records, setRecords] = useState([]);
  const [recordInfo, setRecordInfo] = useState({});

  useEffect(() => {
    // UserController 매개변수 변경 예정
    UserAPI.fetchUser(userId)
      .then((response) => setUser(response))
      .catch((error) => console.debug(error));
  }, [userId]);



  const getRecordById = async () => {
    RecordAPI.fetchRecord(recordId)
      .then((response) => setRecord(response))
      .catch((error) => console.debug(error));
  };

  useEffect(() => {
    RecordAPI.fetchRecords(userId) // 현 사용자 최근 전적 20개
      .then((response) => setRecords(response))
      .catch((error) => console.debug(error));
    RecordAPI.fetchRecordInfo(userId) // 이걸 화면에 뿌려야돼
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
          // padding: 40px;
          border: 2px solid #ccc;
          border-radius: 20px;
          box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
          height: 500px;
          width : 500px;
          display: flex;
          flex-direction: column; 
          justify-content: center; /* 수평 가운데 정렬 */
          align-items: center; /* 수직 가운데 정렬 */
          background: rgba(255, 255, 255, 0.7);
          font-size: 20px;
            font-weight: bold;
        }
        .user-info img {
          width: 250px;
          height: auto;
        }
      `}</style>
      <div className="box"></div>
      <div className="container">
        <div className="user-container">
          <div className="user-info">
            <img src={user.img_path} alt="User Image" style={{ borderRadius: '50%', maxWidth: '100%', height: 'auto' }}/>
            <div>
              {user.family_name}
              {user.given_name}
            </div>
          </div>
          <div className="user-info">
            <div>닉네임: {user.nickname}</div>
            <div>email: {user.email}</div>
            <div>국적: {user.locale}</div>
            {/* <div>상태 : {user.online_status}</div> */}
            {/* <div>보유 골드 : {user.gold}</div> */}
            <div>플레이 게임 수: {recordInfo.played_game_count}</div>
            <div>배틀 게임 승률: {Number.isInteger((recordInfo.win_count / recordInfo.played_battle_game_count) * 100) ?
              (recordInfo.win_count / recordInfo.played_battle_game_count) * 100 : ((recordInfo.win_count /
              recordInfo.played_battle_game_count) * 100).toFixed(2)} %
            </div>
            <div>배틀 게임 승리 횟수: {recordInfo.win_count} / 배틀 게임 플레이 수: {recordInfo.played_battle_game_count}</div>
          </div>
        </div>
      </div>

      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh; /* 최소 화면 높이를 100vh로 설정 */
  background-image: url(${backgroundPath});
  display: flex;
  flex-direction: column;
`;