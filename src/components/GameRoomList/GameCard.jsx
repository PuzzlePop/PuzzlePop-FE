import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

export default function GameCard(props) {
  const { roomId, img, title, isPlaying, totalPieceCount, curPlayerCount, maxPlayerCount } =
    props.data;

  return (
    <Card sx={{ display: "flex" }}>
      <CardMedia component="img" sx={{ width: 151 }} image={img} alt={title} />
      <Box sx={{ display: "flex", flexDirection: "column", paddingLeft: 2 }}>
        <CardContent sx={{ width: "100%", paddingY: "15%" }}>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
            <Typography component="div" variant="h5">
              {title}
            </Typography>
            <Typography sx={{ alignSelf: "end" }} component="div" variant="subtitle2">
              {totalPieceCount}pcs
            </Typography>
          </Box>

          <Divider sx={{ marginY: "3%" }} />

          <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
            <Typography component="div" variant="h5">
              {isPlaying ? "Playing" : "Waiting"}
            </Typography>
            <Typography variant="h6" color="text.secondary" component="div">
              {curPlayerCount} / {maxPlayerCount}
            </Typography>
          </Box>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}></Box>
      </Box>
    </Card>
  );
}
