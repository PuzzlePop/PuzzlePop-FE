import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecordAPI from "../apis/CustomRecordAPI";
import {
  Button,
  Modal,
  Box,
  Grid,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import PercentIcon from "@mui/icons-material/Percent";
import ExtensionIcon from "@mui/icons-material/Extension";
import GroupIcon from "@mui/icons-material/Group";
import GroupsIcon from "@mui/icons-material/Groups";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import backgroundPath from "@/assets/backgrounds/background.gif";
import { Group } from "paper/dist/paper-core";

export default function RankPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // 한 페이지당 표시할 항목 수
  const navigate = useNavigate();

  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            color: deepPurple[400],
            boxShadow: "none", // 그림자 없애기
            "&:hover": {
              backgroundColor: deepPurple[100],
              color: deepPurple[700],
            },
          },
        },
      },
    },
  });

  const [userRanking, setUserRanking] = useState({});
  const [winningRateRankings, setWinningRateRankings] = useState([]);
  const [playedGameCountRankings, setPlayedGameCountRankings] = useState([]);
  const [soloBattleWindCountRankings, setSoloBattleWindCountRankings] = useState([]);
  const [teamBattleWindCountRankings, setTeamBattleWindCountRankings] = useState([]);
  const [currentRankingType, setCurrentRankingType] = useState("winningRate"); // Default to winning rate

  useEffect(() => {
    // Fetch data when component mounts
    const fetchData = async () => {
      try {
        const userRankingData = await RecordAPI.fetchRankingPersonal(1);
        const winningRateRankingsData = await RecordAPI.fetchRankingWinningRate();
        const playedGameCountRankingsData = await RecordAPI.fetchRankingPlayedGameCount();
        const soloBattleWinCountRankingsData = await RecordAPI.fetchRankingSoloBattle();
        const teamBattleWinCountRankingsData = await RecordAPI.fetchRankingTeamBattle();

        setUserRanking(userRankingData);
        setWinningRateRankings(winningRateRankingsData);
        setPlayedGameCountRankings(playedGameCountRankingsData);
        setSoloBattleWindCountRankings(soloBattleWinCountRankingsData);
        setTeamBattleWindCountRankings(teamBattleWinCountRankingsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  let rankings;
  const renderRankings = () => {
    switch (currentRankingType) {
      case "winningRate":
        rankings = winningRateRankings;
        break;
      case "playedGameCount":
        rankings = playedGameCountRankings;
        break;
      case "soloBattleWinCount":
        rankings = soloBattleWindCountRankings;
        break;
      case "teamBattleWinCount":
        rankings = teamBattleWindCountRankings;
        break;
      default:
        rankings = [];
        break;
    }
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRankings = rankings.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <>
        <CardContainer>
          {currentRankings.map((ranking, index) => (
            <Card key={index}>
              <h1>
                <MilitaryTechIcon /> {indexOfFirstItem + index + 1}위
              </h1>
              <div>
                <UserDefaultProfileCard>
                  <div id="profileImg">
                    <img src={ranking.user.img_path} alt={`Rank ${index + 1}`} />
                  </div>
                  <div id="profileInfo">
                    <h2>{ranking.user.nickname}</h2>
                    {ranking.user.email}
                  </div>
                  <div id="profileLinkBtn">
                    <IconButton
                      aria-label="profileBtn"
                      onClick={() => navigate(`/user/${ranking.user.id}`)}
                    >
                      <ContactEmergencyIcon />
                    </IconButton>
                  </div>
                </UserDefaultProfileCard>
                <div>{renderRankingDetails(ranking)}</div>
              </div>
            </Card>
          ))}
        </CardContainer>
      </>
    );
  };

  const renderRankingDetails = (ranking) => {
    switch (currentRankingType) {
      case "winningRate":
        return (
          <>
            <h1>
              {Number.isInteger((ranking.win_count / ranking.played_game_count) * 100) ?
              (ranking.win_count / ranking.played_game_count) * 100 : ((ranking.win_count /
              ranking.played_game_count) * 100).toFixed(2)} %
            </h1>
            WIN <b>{ranking.win_count}</b> | PLAY <b>{ranking.played_game_count}</b>
          </>
        );
      case "playedGameCount":
        return (
          <>
            <h1>{ranking.played_game_count}회!</h1>
          </>
        );
      case "soloBattleWinCount":
        return (
          <>
            <h1>{ranking.win_count}</h1>
            PLAY <b>{ranking.played_game_count}</b>
          </>
        );
      case "teamBattleWinCount":
        return (
          <>
            <h1>{ranking.win_count}</h1>
            PLAY <b>{ranking.played_game_count}</b>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Wrapper>
        <ThemeProvider theme={theme}>
          <Header />

          {/* Buttons for filtering rankings */}
          <ButtonContainer>
            <Button
              size="large"
              variant="contained"
              onClick={() => setCurrentRankingType("playedGameCount")}
              sx={{
                backgroundColor:
                  currentRankingType === "playedGameCount" ? "white" : "rgba(0, 0, 0, 0)",
                color: currentRankingType === "playedGameCount" ? "black" : "deepPurple[400]",
                margin: "5px",
              }}
            >
              <ExtensionIcon />
              플레이 게임 수
            </Button>
            <Button
              size="large"
              variant="contained"
              onClick={() => setCurrentRankingType("winningRate")}
              sx={{
                backgroundColor:
                  currentRankingType === "winningRate" ? "white" : "rgba(0, 0, 0, 0)",
                color: currentRankingType === "winningRate" ? "black" : "deepPurple[400]",
                margin: "5px",
              }}
            >
              <PercentIcon />
              배틀 게임 승률
            </Button>

            <Button
              size="large"
              variant="contained"
              onClick={() => setCurrentRankingType("soloBattleWinCount")}
              sx={{
                backgroundColor:
                  currentRankingType === "soloBattleWinCount" ? "white" : "rgba(0, 0, 0, 0)",
                color: currentRankingType === "soloBattleWinCount" ? "black" : "deepPurple[400]",
                margin: "5px",
              }}
            >
              <GroupIcon />
              1:1 배틀 승리 수
            </Button>
            <Button
              size="large"
              variant="contained"
              onClick={() => setCurrentRankingType("teamBattleWinCount")}
              sx={{
                backgroundColor:
                  currentRankingType === "teamBattleWinCount" ? "white" : "rgba(0, 0, 0, 0)",
                color: currentRankingType === "teamBattleWinCount" ? "black" : "deepPurple[400]",
                margin: "5px",
              }}
            >
              <GroupsIcon />팀 배틀 승리 수
            </Button>
          </ButtonContainer>

          {/* Render rankings based on current ranking type */}
          {/* <h2>{currentRankingType === 'winningRate' ? 'Winning Rate' : currentRankingType === 'playedGameCount' ? 'Played Game Count' : currentRankingType === 'soloBattleWinCount' ? 'Solo Battle Win Count' : currentRankingType === 'teamBattleWinCount' ? 'Team Battle Win Count' : 'User Ranking'} Rankings</h2> */}
          {renderRankings()}
          <PaginationContainer>
            <StyledButton
              variant="outlined"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </StyledButton>
            <Typography>{currentPage}</Typography>
            <StyledButton
              variant="outlined"
              disabled={currentPage === Math.ceil(rankings.length / itemsPerPage)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </StyledButton>
          </PaginationContainer>
        </ThemeProvider>
        <Footer />
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh; /* 최소 화면 높이를 100vh로 설정 */
  background-image: url(${backgroundPath});
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid ${deepPurple[100]};
  padding: 3px 10px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Card = styled.div`
  background-color: rgba(255, 255, 255, 0.8); /* 흰색 배경에 투명도 적용 */
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin: 10px 0;
  padding: 20px;
  width: 80%;
  max-width: 500px;
  img {
    border-radius: 50%; // 이미지를 동그랗게 만들기
    max-width: 100%; // 이미지가 부모 요소를 넘어가지 않도록
    height: auto; // 가로 세로 비율 유지
  }
`;

const UserDefaultProfileCard = styled.div`
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  #profileImg,
  #profileInfo,
  #profileLinkBtn {
    margin-right: 20px;
  }
  #profileImg {
    max-width: 80px;
    max-height: 80px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 60px;

  & > * {
    margin: 0 5px;
  }
`;

const StyledButton = styled(Button)`
  && {
    background-color: rgba(255, 255, 255, 0.5);
    color: black;
    margin: 0 5px;
  }

  &&:hover {
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
  }
`;
