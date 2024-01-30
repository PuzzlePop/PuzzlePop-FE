import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import styled from "styled-components";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import GameCard from "@/components/GameRoomList/GameCard";

let idx = 1;
const dummyData = [
  {
    roomId: idx++,
    img: "https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/cnoC/image/R7FVHsxQscWuMqj6TtNhHLSH8do",
    title: "방 제목입니다.",
    isPlaying: false,
    totalPieceCount: 300,
    curPlayerCount: 3,
    maxPlayerCount: 4,
  },
  {
    roomId: idx++,
    img: "https://i.namu.wiki/i/yzxvPP2u3vcW4IpzOPGLEDn24IA_1V4nUGUy6hOaFGDQ5JH3mqVQyCnk4bZU4MZVzovE3AuHGeToAZIM7zCb_A.webp",
    title: "방 제목입니다.",
    isPlaying: false,
    totalPieceCount: 400,
    curPlayerCount: 1,
    maxPlayerCount: 6,
  },
  {
    roomId: idx++,
    img: "https://image.musinsa.com/mfile_s01/2020/03/24/3c72bdfc947216905f3d746a1df2a424145252.jpg",
    title: "방 제목입니다.",
    isPlaying: false,
    totalPieceCount: 200,
    curPlayerCount: 6,
    maxPlayerCount: 8,
  },
  {
    roomId: idx++,
    img: "https://i.pinimg.com/236x/99/7a/9b/997a9b2cd93277769ca9b3d109bceed7.jpg",
    title: "방 제목입니다.",
    isPlaying: false,
    totalPieceCount: 200,
    curPlayerCount: 6,
    maxPlayerCount: 8,
  },
  {
    roomId: idx++,
    img: "https://i.pinimg.com/564x/45/37/6f/45376f04779beaf4436a146cd9fff3f2.jpg",
    title: "방 제목입니다.",
    isPlaying: true,
    totalPieceCount: 200,
    curPlayerCount: 2,
    maxPlayerCount: 2,
  },
  {
    roomId: idx++,
    img: "https://cdn2.colley.kr/item_127602_1_1_title_1.jpeg?d=550x550",
    title: "방 제목입니다.",
    isPlaying: true,
    totalPieceCount: 200,
    curPlayerCount: 2,
    maxPlayerCount: 2,
  },
  {
    roomId: idx++,
    img: "https://muko.kr/files/attach/images/2022/11/22/c1947e3fa7cfcc93a4c18b0a165e2e51.jpg",
    title: "방 제목입니다.",
    isPlaying: true,
    totalPieceCount: 200,
    curPlayerCount: 2,
    maxPlayerCount: 2,
  },
  {
    roomId: idx++,
    img: "https://mblogthumb-phinf.pstatic.net/MjAyMzAxMTRfMjAz/MDAxNjczNjc4MDQwOTQx.9rDmBy0Op1KxDzRS3aMLrarvkB3OERcMmnZ0zHH5Oo8g.beI30adbPBQZWQVp3L0aBE38B3yyPJsmUTMc4Stxsx0g.JPEG.yurim5638/IMG_6022.JPG?type=w800",
    title: "방 제목입니다.",
    isPlaying: true,
    totalPieceCount: 400,
    curPlayerCount: 4,
    maxPlayerCount: 4,
  },
];

export default function GameRoomListBoard(props) {
  const [rooms, setRooms] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);

  const makeEmptyRooms = (rooms) => {
    const result = [];

    for (let i = 0; i < 6 - rooms.length; i++) {
      result.push(
        <Grid xs={6} key={`empty ${i}`}>
          <EmptyCard></EmptyCard>
        </Grid>,
      );
    }

    return result;
  };

  useEffect(() => {
    setTotalPage(parseInt(dummyData.length / 6) + 1);
  }, []);

  useEffect(() => {
    setRooms(dummyData.slice((page - 1) * 6, page * 6));
  }, [page]);

  return (
    <Wrapper>
      <Grid container spacing={4}>
        {rooms.map((data) => {
          return (
            <Grid xs={6} key={data.roomId}>
              <GameCard data={data} category={props.category} />
            </Grid>
          );
        })}
        {makeEmptyRooms(rooms)}
      </Grid>
      <Pagination
        page={page}
        count={totalPage}
        size="large"
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`/game/${props.category}${item.page === 1 ? "" : `?page=${item.page}`}`}
            {...item}
          />
        )}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 950px;
  margin: 5% auto;
  background-color: white;
  border-radius: 20px;
  padding: 3%;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const EmptyCard = styled(Card)`
  width: 460px;
  height: 150px;
  background-color: #eee;
`;
