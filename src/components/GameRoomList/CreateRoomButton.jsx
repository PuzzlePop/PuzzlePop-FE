import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  createTheme,
  ThemeProvider,
  deprecatedPropType,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { request } from "@/apis/requestBuilder";
import { setRoomId, setSender } from "@/socket-utils/storage";

export default function CreateRoomButton({ category }) {
  const navigate = useNavigate();
  const [roomTitle, setRoomTitle] = useState("");
  const [roomSize, setRoomSize] = useState(2);
  const [isOpenedModal, setIsOpenedModal] = useState(false);

  const handleClose = () => {
    setRoomTitle("");
    setRoomSize(2);
    setIsOpenedModal(false);
  };

  const handleRoomSize = (e) => {
    const count = Number(e.target.value);
    if (2 <= count && count <= 8) {
      setRoomSize(count);
    }
  };

  const createRoom = async () => {
    if (!roomTitle) {
      return;
    }

    const sender = window.prompt("닉네임을 입력해주세요");
    if (!sender) {
      return;
    }
    setSender(sender);

    const { data } = await request.post("/game/room", {
      name: roomTitle,
      userid: sender,
      type: "TEAM",
      roomSize,
      gameType: category.toUpperCase(),
    });
    // 방 속성 정보
    const { blueTeam, gameId, gameName, gameType, isStarted, redTeam, sessionToUser, startTime } =
      data;
    setRoomId(gameId);
    navigate(`/game/${category}/waiting/${gameId}`);
  };

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
      <Button variant="outlined" onClick={() => setIsOpenedModal(true)}>
        방 만들기
      </Button>
      <Modal
        open={isOpenedModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography id="modal-modal-title" variant="h5">
            {category === "cooperation" ? "협동" : "배틀"}방 만들기
          </Typography>
          <Grid container id="modal-modal-description" spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="방 제목"
                value={roomTitle}
                onChange={(e) => setRoomTitle(e.target.value)}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={9}>
              {category === "cooperation" ? (
                <TextField
                  label="최대 인원수"
                  type="number"
                  value={roomSize}
                  onChange={handleRoomSize}
                  sx={{ width: "100%" }}
                  helperText="최소 2인 최대 8인 플레이 가능합니다."
                />
              ) : (
                <FormControl>
                  <FormLabel id="demo-controlled-radio-buttons-group">최대 인원수</FormLabel>
                  <RadioGroup row value={roomSize} onChange={handleRoomSize}>
                    <FormControlLabel value={2} control={<Radio />} label="1:1" />
                    <FormControlLabel value={4} control={<Radio />} label="2:2" />
                    <FormControlLabel value={6} control={<Radio />} label="3:3" />
                    <FormControlLabel value={8} control={<Radio />} label="4:4" />
                  </RadioGroup>
                </FormControl>
              )}
            </Grid>
            <Grid item xs={3}>
              <Button
                disabled={!roomTitle}
                onClick={createRoom}
                sx={{ width: "100%", height: "50px", padding: "2%", margin: "15% auto" }}
              >
                방 만들기
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </ThemeProvider>
  );
}
