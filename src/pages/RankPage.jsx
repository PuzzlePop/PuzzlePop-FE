import { useEffect, useState } from "react";
import Header from "../components/Header";
import RecordAPI from "../apis/CustomRecordAPI";

export default function RankPage() {
  const [userRanking, setUserRanking] = useState({});
  const [winningRateRankings, setWinningRateRankings] = useState([]);
  const [playedGameCountRankings, setPlayedGameCountRankings] = useState([]);
  const [soloBattleWindCountRankings, setSoloBattleWindCountRankings] = useState([]);
  const [teamBattleWindCountRankings, setTeamBattleWindCountRankings] = useState([]);

  useEffect(() => {
    RecordAPI.fetchRankingPersonal(1)
      .then(response => setUserRanking(response))
      .catch(error => console.debug(error));
    RecordAPI.fetchRankingWinningRate()
      .then(response => setWinningRateRankings(response))
      .catch(error => console.debug(error));
    RecordAPI.fetchRankingPlayedGameCount()
      .then(response => setPlayedGameCountRankings(response))
      .catch(error => console.debug(error));
    RecordAPI.fetchRankingSoloBattle()
      .then(response => setSoloBattleWindCountRankings(response))
      .catch(error => console.debug(error));
    RecordAPI.fetchRankingTeamBattle()
      .then(response => setTeamBattleWindCountRankings(response))
      .catch(error => console.debug(error));
  }, []);

  return (
    <>
      <Header />
      <h1>Ranking Page</h1>

      <hr />
      <h2>UserRanking</h2>
      <div>UserRanking.userId: { userRanking.userId }</div>
      <div>UserRanking.winningRateRank: {userRanking.winningRateRank}</div>
      <div>UserRanking.playedGameCountRank: {userRanking.playedGameCountRank}</div>
      <div>UserRanking.soloBattleWinCountRank: {userRanking.soloBattleWinCountRank}</div>
      <div>UserRanking.teamBattleWinCountRank: {userRanking.teamBattleWinCountRank}</div>
      

      <hr />
      <h2>WinningRateRankings</h2>
      {winningRateRankings.map((ranking, index) => (
        <ul key={index}>
            <li>winningRateRankings[{index}].winningRate: {ranking.winningRate}</li>
            <li>winningRateRankings[{index}].winCount: {ranking.winCount}</li>
            <li>winningRateRankings[{index}].playedGameCount: {ranking.playedGameCount}</li>
            <li>winningRateRankings[{index}].user.id: {ranking.user.id}</li>
            <li>winningRateRankings[{index}].user.email: {ranking.user.email}</li>
            <li>winningRateRankings[{index}].user.nickname: {ranking.user.nickname}</li>
            <li>winningRateRankings[{index}].user.givenName: {ranking.user.givenName}</li>
            <li>winningRateRankings[{index}].user.familyName: {ranking.user.familyName}</li>
            <li>winningRateRankings[{index}].user.imgPath: {ranking.user.imgPath}</li>
            <li>winningRateRankings[{index}].user.locale: {ranking.user.locale}</li>
            <li>winningRateRankings[{index}].user.onlineStatus: {ranking.user.onlineStatus}</li>
            <hr />
        </ul>
      ))}

      
      <hr />
      <h2>playedGameCountRankings</h2>
      {playedGameCountRankings.map((ranking, index) => (
        <ul key={index}>
            <li>playedGameCountRankings[{index}].playedGameCount: {ranking.playedGameCount}</li>
            <li>playedGameCountRankings[{index}].user.id: {ranking.user.id}</li>
            <li>playedGameCountRankings[{index}].user.email: {ranking.user.email}</li>
            <li>playedGameCountRankings[{index}].user.nickname: {ranking.user.nickname}</li>
            <li>playedGameCountRankings[{index}].user.givenName: {ranking.user.givenName}</li>
            <li>playedGameCountRankings[{index}].user.familyName: {ranking.user.familyName}</li>
            <li>playedGameCountRankings[{index}].user.imgPath: {ranking.user.imgPath}</li>
            <li>playedGameCountRankings[{index}].user.locale: {ranking.user.locale}</li>
            <li>playedGameCountRankings[{index}].user.onlineStatus: {ranking.user.onlineStatus}</li>
            <hr />
        </ul>
      ))}

      <hr />
      <h2>soloBattleWindCountRankings</h2>
      {soloBattleWindCountRankings.map((ranking, index) => (
        <ul key={index}>
            <li>soloBattleWindCountRankings[{index}].winCount: {ranking.winCount}</li>
            <li>soloBattleWindCountRankings[{index}].playedGameCount: {ranking.playedGameCount}</li>
            <li>soloBattleWindCountRankings[{index}].user.id: {ranking.user.id}</li>
            <li>soloBattleWindCountRankings[{index}].user.email: {ranking.user.email}</li>
            <li>soloBattleWindCountRankings[{index}].user.nickname: {ranking.user.nickname}</li>
            <li>soloBattleWindCountRankings[{index}].user.givenName: {ranking.user.givenName}</li>
            <li>soloBattleWindCountRankings[{index}].user.familyName: {ranking.user.familyName}</li>
            <li>soloBattleWindCountRankings[{index}].user.imgPath: {ranking.user.imgPath}</li>
            <li>soloBattleWindCountRankings[{index}].user.locale: {ranking.user.locale}</li>
            <li>soloBattleWindCountRankings[{index}].user.onlineStatus: {ranking.user.onlineStatus}</li>
            <hr />
        </ul>
      ))}

      <hr />
      <h2>teamBattleWindCountRankings</h2>
      {teamBattleWindCountRankings.map((ranking, index) => (
        <ul key={index}>
            <li>teamBattleWindCountRankings[{index}].winCount: {ranking.winCount}</li>
            <li>teamBattleWindCountRankings[{index}].playedGameCount: {ranking.playedGameCount}</li>
            <li>teamBattleWindCountRankings[{index}].user.id: {ranking.user.id}</li>
            <li>teamBattleWindCountRankings[{index}].user.email: {ranking.user.email}</li>
            <li>teamBattleWindCountRankings[{index}].user.nickname: {ranking.user.nickname}</li>
            <li>teamBattleWindCountRankings[{index}].user.givenName: {ranking.user.givenName}</li>
            <li>teamBattleWindCountRankings[{index}].user.familyName: {ranking.user.familyName}</li>
            <li>teamBattleWindCountRankings[{index}].user.imgPath: {ranking.user.imgPath}</li>
            <li>teamBattleWindCountRankings[{index}].user.locale: {ranking.user.locale}</li>
            <li>teamBattleWindCountRankings[{index}].user.onlineStatus: {ranking.user.onlineStatus}</li>
            <hr />
        </ul>
      ))}

    </>
  );
}
