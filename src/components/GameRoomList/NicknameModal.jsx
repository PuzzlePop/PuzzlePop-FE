import { Dialog, Box, TextField, Grid, Typography, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";

export default function NicknameModal({
  nickname,
  setNickname,
  open,
  handleClose,
  handleKeyUp,
  createRoom,
  gameId,
}) {
  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            color: deepPurple[700],
            fontSize: "15px",
            height: "80%",
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: deepPurple[100],
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            margin: "3% auto",

            "& label": {
              color: deepPurple[200],
            },
            "& label.Mui-focused": {
              color: deepPurple[700],
            },
            "& .MuiOutlinedInput-root": {
              color: deepPurple[700],
              "& fieldset": {
                borderColor: deepPurple[200],
              },
              "&:hover fieldset": {
                borderColor: deepPurple[400],
              },
              "&.Mui-focused fieldset": {
                borderColor: deepPurple[700],
              },
            },
            "& .MuiFormHelperText-root": {
              color: deepPurple[400],
            },
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: deepPurple[200],
            "&.Mui-focused": {
              color: deepPurple[400],
            },
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            "&.Mui-checked": {
              color: deepPurple[400],
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={handleClose}>
        <Box sx={{ margin: "30px 40px" }}>
          <Typography id="modal-modal-title" variant="h5">
            닉네임을 입력해주세요!
          </Typography>
          <Grid container id="modal-modal-description" spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyUp={(e) => handleKeyUp(e, gameId)}
                autoFocus
                sx={{ width: "100%" }}
              />
            </Grid>

            <Grid item xs={9}></Grid>

            <Grid item xs={3}>
              <Button
                disabled={!nickname}
                onClick={createRoom}
                id={gameId}
                sx={{ width: "100%", height: "50px", padding: "2%", margin: "15% auto" }}
              >
                확인
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </ThemeProvider>
  );
}
