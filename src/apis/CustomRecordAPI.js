import axios from 'axios';

export const RecordAPI = axios.create({
    // baseURL: 'https://i10a304.p.ssafy.io/api',
    baseURL: 'http://localhost:8080',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchRecord = async (id) => {
    const response = await RecordAPI.get(`/record/${id}`);
    return response.data;
};

export const fetchRecords = async (userId) => {
    const response = await RecordAPI.get(`/record/list?user_id=${userId}`);
    return response.data;
};

export const fetchRecordInfo = async (userId) => {
    const response = await RecordAPI.get(`/record/info?user_id=${userId}`);
    return response.data;
};

////////////////////////////////////////////////////////////////////////////////////////
export const fetchRankingSoloBattle = async () => {
    const response = await RecordAPI.get(`/record/ranking/soloBattle`);
    return response.data;
};

export const fetchRankingTeamBattle = async () => {
    const response = await RecordAPI.get(`/record/ranking/teamBattle`);
    return response.data;
};

export const fetchRankingWinningRate = async () => {
    const response = await RecordAPI.get(`/record/ranking/winningRate`);
    return response.data;
};

export const fetchRankingPlayedGameCount = async () => {
    const response = await RecordAPI.get(`/record/ranking/playedGameCount`);
    return response.data;
};

export const fetchRankingPersonal = async (userId) => {
    const response = await RecordAPI.get(`/record/ranking/personal?user_id=${userId}`);
    return response.data;
};

////////////////////////////////////////////////////////////////////////////////////////
const ApiObject = {
    RecordAPI,
    fetchRecord,
    fetchRecords,
    fetchRecordInfo,

    fetchRankingSoloBattle,
    fetchRankingTeamBattle,
    fetchRankingWinningRate,
    fetchRankingPlayedGameCount,
    fetchRankingPersonal,
};
export default ApiObject;