import { useState } from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { request } from "../../apis/requestBuilder";
import { getSender, getRoomId } from "@/socket-utils/storage";

let idx = 9;
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

  return (
    <InnerBox>
      <ImgButton src={selectedImg} onClick={handleClickOpen} />
      <FormControl sx={{ m: 1, minWidth: "80%" }}>
        <InputLabel id="piece-num-label">피스 수</InputLabel>
        <PieceSelect
          labelId="piece-num-label"
          label="피스 수"
          value={selectedPieceNum}
          onChange={handleChange}
        >
          {allowedPiece.map((piece) => {
            return (
              <MenuItem key={piece} value={piece}>
                {piece}
              </MenuItem>
            );
          })}
        </PieceSelect>
      </FormControl>

      <ImgDialog selectedImg={selectedImg} open={open} onClose={handleClose} />
    </InnerBox>
  );
}

function ImgDialog({ onClose, selectedImg, open }) {
  const handleClose = () => {
    onClose(selectedImg);
  };

  const handleImgClick = async (value) => {

    try {
      const res = await request.post(`/game/room/picture`, {
        picture : {
          id : value
        },
        user : {
          id : getSender()
        },
        uuid : getRoomId()
      })
          
      onClose(value);
    } catch(e) {
      console.log(e)
    }
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="md">
      <Typography variant="h4" sx={{ margin: "5% 10% 2% 10%" }}>
        퍼즐 그림 선택하기
      </Typography>
      <Grid container sx={{ width: "80%", margin: "0 10% 5% 10%" }}>
        {dummyData.map((data) => {
          return (
            <Grid key={data.idx} item xs={3}>
              <ImgButton src={data.src} value={data.src} onClick={() => handleImgClick(data.idx)} />
            </Grid>
          );
        })}
      </Grid>
    </Dialog>
  );
}

const InnerBox = styled(Box)`
  width: 95%;
  padding: 2% 3%;
  margin: 5px 0;
  background-color: #eee;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImgButton = styled.img`
  width: 80%;
  margin: 10% auto 5% auto;
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
`;
