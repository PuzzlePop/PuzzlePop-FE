import Grid from "@mui/material/Unstable_Grid2";
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
];

export default function GameRoomListBoard(props) {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        margin: "5% auto",
        backgroundColor: "white",
        borderRadius: "2%",
        padding: "3%",
        width: "80%",
        border: "1px solid #ccc",
      }}
    >
      {dummyData.map((data) => {
        return (
          <Grid xs={6} key={data.roomId}>
            <GameCard data={data} category={props.category} />
          </Grid>
        );
      })}
    </Grid>
  );
}
