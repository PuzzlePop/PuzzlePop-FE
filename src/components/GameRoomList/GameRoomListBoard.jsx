import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import styled from "styled-components";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import GameCard from "@/components/GameRoomList/GameCard";

export default function GameRoomListBoard({ category, roomList }) {
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
    setTotalPage(parseInt(roomList.length / 6) + 1);
  }, [roomList]);

  useEffect(() => {
    setRooms(roomList.slice((page - 1) * 6, page * 6));
  }, [page, roomList]);

  return (
    <Wrapper>
      <Grid container spacing={4}>
        {rooms.map((room) => {
          return (
            <Grid xs={6} key={room.gameId}>
              <GameCard room={room} category={category} />
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
            to={`/game/${category}${item.page === 1 ? "" : `?page=${item.page}`}`}
            {...item}
          />
        )}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 950px;
  margin: 1% auto 5% auto;
  background-color: rgba(255, 255, 255, 0.6);
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
  background-color: rgba(238, 238, 238, 0.2);
`;
