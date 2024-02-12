import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import styled from "styled-components";
// import Grid from "@mui/material/Unstable_Grid2";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";
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
        <Grid item xs={6} key={`empty ${i}`}>
          <EmptyCard></EmptyCard>
        </Grid>,
      );
    }

    return result;
  };

  useEffect(() => {
    setTotalPage(Math.ceil(roomList.length / 6));
  }, [roomList]);

  useEffect(() => {
    setRooms(roomList.slice((page - 1) * 6, page * 6));
  }, [page, roomList]);

  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
    palette: {
      purple: {
        light: deepPurple[500],
        main: deepPurple[600],
        dark: deepPurple[700],
        darker: deepPurple[800],
        contrastText: "#fff",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <Grid container spacing={2}>
          {rooms.map((room) => {
            return (
              <Grid item xs={6} key={room.gameId}>
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
          variant="outlined"
          color="purple"
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={`/game/${category}${item.page === 1 ? "" : `?page=${item.page}`}`}
              {...item}
            />
          )}
        />
      </Wrapper>
    </ThemeProvider>
  );
}

const Wrapper = styled.div`
  width: 950px;
  margin: 1% auto 5% auto;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  padding: 3%;
  padding-bottom: 2%;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const EmptyCard = styled(Card)`
  width: 460px;
  height: 150px;
  background-color: rgba(238, 238, 238, 0.2);
`;
