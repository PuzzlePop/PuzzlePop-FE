import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  Typography,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";
import { request, requestFile } from "@/apis/requestBuilder";
import { getSender, getRoomId } from "@/socket-utils/storage";

let idx = 1;
const dummyData = [
  {
    idx: idx++,
    src: "https://res.heraldm.com/content/image/2015/03/06/20150306001045_0.jpg",
  },
  {
    idx: idx++,
    src: "https://m.prugna.co.kr/web/product/big/202211/9d7750409c1193bb10a15dcba01f3d6a.jpg",
  },
  {
    idx: idx++,
    src: "https://img.sbs.co.kr/newsnet/etv/upload/2023/12/11/30000894114_700.jpg",
  },
  // {
  //   idx: idx++,
  //   src: "https://image.tving.com/ntgs/contents/CTC/caip/CAIP1500/ko/20220925/P001647858.jpg/dims/resize/1280",
  // },
  {
    idx: idx++,
    src: "https://i.pinimg.com/originals/fd/26/a1/fd26a15bf2032a616e820da21e6f9752.jpg",
  },
  {
    idx: idx++,
    src: "https://blog.kakaocdn.net/dn/ClKFD/btrgoBQVbxF/817hYNUiL4rWZuiBaMj8Y0/img.jpg",
  },
  {
    idx: idx++,
    src: "https://mblogthumb-phinf.pstatic.net/MjAyMDA4MjdfOTkg/MDAxNTk4NTIwNjg1MTcy.rF-rPPZHcu7_Z-_9a4mJOHegxM72AI7o5G4xu2LWR2Eg.QuItX-TXQievex-_o-Ru-qTwH3NYHPBBL3v-QqLxOrcg.JPEG.sonss1997/IMG_3245.JPG?type=w800",
  },
  // {
  //   idx: idx++,
  //   src: "https://i.pinimg.com/originals/75/9e/75/759e75e01a6e3a05ceee8026f7c8d2d3.gif",
  // },
  {
    idx: idx++,
    src: "https://i.pinimg.com/736x/14/ab/10/14ab10a5ed90e5dec2b7541a33b28d2b.jpg",
  },
  {
    idx: idx++,
    src: "https://mblogthumb-phinf.pstatic.net/MjAyMDEyMTRfMTc4/MDAxNjA3ODczMjQxMTMy.X0tBMIppFjHEk95t-f0mR8c7FGVtjYQpsaHcpWUQQQ4g.jsEOK75krPKjrRBRUW9dUXTvajrgIIia4YSq6yEJeQwg.JPEG.sosohan_n/m_i_n_g__y_i.jpg?type=w800",
  },
  {
    idx: idx++,
    src: "https://mblogthumb-phinf.pstatic.net/MjAyMDEyMTRfMTMg/MDAxNjA3ODczMzIzOTY5.BkIhte0DHjgH7GHIfk85lfIW0qdbJFZdDawJX9uVwCIg.Do2Nsv5zDp2pYHN0_-US9_RGz8JXML9jzn-wOAzjLwMg.JPEG.sosohan_n/JJ_(14).jpg?type=w800",
  },
];

export default function SelectImgAndPiece({ src, allowedPiece }) {
  const [open, setOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(src);
  const [selectedPieceNum, setSelectedPieceNum] = useState(allowedPiece[0]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedImg(value);
  };

  const handleChange = (event) => {
    setSelectedPieceNum(event.target.value);
  };

  useEffect(() => {
    if (src === "짱구.jpg") {
      setSelectedImg(
        "https://i.namu.wiki/i/1zQlFS0_ZoofiPI4-mcmXA8zXHEcgFiAbHcnjGr7RAEyjwMHvDbrbsc8ekjZ5iWMGyzJrGl96Fv5ZIgm6YR_nA.webp",
      );
    }
  }, []);

  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
    palette: {
      purple: {
        light: deepPurple[200],
        main: deepPurple[300],
        dark: deepPurple[400],
        darker: deepPurple[600],
        contrastText: "#fff",
      },
    },
    components: {
      MuiSelect: {
        styleOverrides: {
          root: {
            "& .Mui-selected": {
              backgroundColor: deepPurple[100],
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <InnerBox>
        <Typography sx={{ mt: 1 }}>그림, 피스 수 선택</Typography>
        <ImgButton src={selectedImg} onClick={handleClickOpen} />
        <FormControl sx={{ m: 1, minWidth: "80%" }}>
          <InputLabel id="piece-num-label">피스 수</InputLabel>
          <PieceSelect
            labelId="piece-num-label"
            label="피스 수"
            color="purple"
            size="small"
            value={selectedPieceNum}
            onChange={handleChange}
          >
            {allowedPiece.map((piece) => {
              return (
                <MenuItem
                  key={piece}
                  value={piece}
                  sx={{
                    ":hover": { backgroundColor: deepPurple[50] },
                    "&.Mui-selected": {
                      backgroundColor: deepPurple[100],
                      ":hover": { backgroundColor: deepPurple[50] },
                    },
                  }}
                >
                  {piece}
                </MenuItem>
              );
            })}
          </PieceSelect>
        </FormControl>

        <ImgDialog selectedImg={selectedImg} open={open} onClose={handleClose} />
      </InnerBox>
    </ThemeProvider>
  );
}

function ImgDialog({ onClose, selectedImg, open }) {
  const [imageList, setImageList] = useState([]);
  // const [file, setFile] = useState(null);

  async function fetchImage() {
    try {
      const res = await request.get("/image/list/puzzle");
      // const decodedImageList = res.data.map(imageData => ({
      //   ...imageData,
      //   base64_image: atob(imageData.base64_image)
      // }));
      console.log("이미지 데이터들:", res.data);
      setImageList(res.data);
    } catch (error) {
      console.error("Error fetching image data:", error);
    }
  }

  useEffect(() => {
    fetchImage();
  }, []);

  const handleClose = () => {
    onClose(selectedImg);
  };

  const handleImgClick = async (value, src) => {
    console.log("handleImgClick", value);
    try {
      const res = await request.post(`/game/room/picture`, {
        picture: {
          id: value,
        },
        user: {
          id: getSender(),
        },
        uuid: getRoomId(),
      });

      onClose(src);
    } catch (e) {
      console.log(e);
    }
  };

  const handleFileChange = async (event) => {
    console.log("handleFileChange", event.target.files[0]);
    postFile(event.target.files[0]);
  };

  const postFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "sPuzzle");
    const res = await requestFile.post("/image", formData);

    console.log("postFile", res.data);

    const imgRes = await request.get(`/image/${res.data}`);
    onClose(`data:image/jpeg;base64,${imgRes.data}`);
    fetchImage();
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="md">
      <Typography
        variant="h4"
        sx={{ margin: "5% 10% 2% 10%", fontWeight: "bold", color: "#9575cd" }}
      >
        퍼즐 그림 선택하기
      </Typography>
      <Grid container sx={{ width: "80%", margin: "0 10% 5% 10%" }}>
        {imageList.map((data) => {
          return (
            <Grid key={data.id} item xs={3}>
              <ImgButton
                src={`data:image/jpeg;base64,${data.base64_image}`}
                value={data.base64_image}
                onClick={() =>
                  handleImgClick(data.id, `data:image/jpeg;base64,${data.base64_image}`)
                }
              />
            </Grid>
          );
        })}
        <Grid item xs={3}>
          <PlusButton component="label">
            <AddIcon sx={{ color: "#9575cd", width: "100%" }} />
            <VisuallyHiddenInput
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
            />
          </PlusButton>
        </Grid>
      </Grid>
    </Dialog>
  );
}

const InnerBox = styled(Box)`
  width: 95%;
  padding: 2% 3%;
  margin: 5px 0;
  background-color: rgba(231, 224, 255, 0.7);
  border: 1px solid #c4b6fb;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  & label.Mui-focused {
    color: ${deepPurple[400]};
  }
`;

const ImgButton = styled.img`
  width: 80%;
  margin: 3% auto 5% auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    transition: all 0.3s;
    box-shadow: 3px 3px 8px lightgray;
  }
`;

const PieceSelect = styled(Select)`
  margin-bottom: 5%;
  background-color: white;

  & li.Mui-selected {
    background-color: ${deepPurple[100]};
  }
`;

const PlusButton = styled(Button)`
  width: 80%;
  height: 120px;
  margin: 10% auto 5% auto;
  border: 3px solid #d1c4e9;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    transition: all 0.3s;
    background-color: #ede7f6;
    box-shadow: 3px 3px 8px #7e57c2;
  }

  & .MuiSvgIcon-root {
    font-size: 35px;
  }
`;

const VisuallyHiddenInput = styled.input`
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  whitespace: nowrap;
  width: 1;
`;
