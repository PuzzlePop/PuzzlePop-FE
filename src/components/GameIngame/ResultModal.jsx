import { PlayerCard } from "@/components/GameWaiting/PlayerCard";
import { getTeam } from "@/socket-utils/storage";

import { Box, Dialog, DialogTitle, DialogContent, Snackbar, Grid } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getRoomId } from "../../socket-utils/storage";

export default function ResultModal({
  isOpenedDialog,
  handleCloseGame,
  ourPercent,
  enemyPercent,
  ourTeam,
  enemyTeam,
}) {
  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={isOpenedDialog} onClose={handleCloseGame}>
        <DialogTitle>게임 결과</DialogTitle>
        <DialogContent>
          {ourPercent}% : {enemyPercent}%
          <Grid container>
            {ourTeam.map((player) => {
              <Grid item xs={3}>
                <PlayerCard player={player} color={getTeam()} gameId={getRoomId()} />
              </Grid>;
            })}
          </Grid>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
