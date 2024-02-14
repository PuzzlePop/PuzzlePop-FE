import { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
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
import backgroundPath from "@/assets/backgrounds/background.gif";

export default function RankPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // 한 페이지당 표시할 항목 수

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
      <CardContainer>
        {currentRankings.map((ranking, index) => (
          <Card key={index}>
            <ul>
              <li>
                {currentRankingType} Rank: {ranking[currentRankingType]}
              </li>
              <li>Win Count: {ranking.winCount}</li>
              <li>Played Game Count: {ranking.playedGameCount}</li>
              <li>User ID: {ranking.user.id}</li>
              <li>User Email: {ranking.user.email}</li>
              {/* Render other user information */}
            </ul>
          </Card>
        ))}
      </CardContainer>
    );
  };

  return (
    <Wrapper>
      <Header />

      {/* Buttons for filtering rankings */}
      <ButtonContainer>
        <Button
          variant="contained"
          onClick={() => setCurrentRankingType("winningRate")}
          sx={{
            backgroundColor: currentRankingType === "winningRate" ? "white" : "black",
            color: currentRankingType === "winningRate" ? "black" : "white",
            margin: "5px",
          }}
        >
          Winning Rate
        </Button>
        <Button
          variant="contained"
          onClick={() => setCurrentRankingType("playedGameCount")}
          sx={{
            backgroundColor: currentRankingType === "playedGameCount" ? "white" : "black",
            color: currentRankingType === "playedGameCount" ? "black" : "white",
            margin: "5px",
          }}
        >
          Played Game Count
        </Button>
        <Button
          variant="contained"
          onClick={() => setCurrentRankingType("soloBattleWinCount")}
          sx={{
            backgroundColor: currentRankingType === "soloBattleWinCount" ? "white" : "black",
            color: currentRankingType === "soloBattleWinCount" ? "black" : "white",
            margin: "5px",
          }}
        >
          Solo Battle Win Count
        </Button>
        <Button
          variant="contained"
          onClick={() => setCurrentRankingType("teamBattleWinCount")}
          sx={{
            backgroundColor: currentRankingType === "teamBattleWinCount" ? "white" : "black",
            color: currentRankingType === "teamBattleWinCount" ? "black" : "white",
            margin: "5px",
          }}
        >
          Team Battle Win Count
        </Button>
      </ButtonContainer>

      <hr />
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
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
  background-image: url(${backgroundPath});
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
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
  max-width: 400px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  & > * {
    margin: 0 5px;
  }
`;

const StyledButton = styled(Button)`
  && {
    background-color: white;
    color: black;
    margin: 0 5px;
  }

  &&:hover {
    background-color: black;
    color: white;
  }
`;
