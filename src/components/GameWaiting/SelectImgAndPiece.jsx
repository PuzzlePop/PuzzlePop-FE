import { useState } from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { style } from "@mui/system";

export default function SelectImgAndPiece({ src, allowedPiece }) {
  const [pieceNum, setPieceNum] = useState(allowedPiece[0]);

  const handleChange = (event) => {
    setPieceNum(event.target.value);
  };

  return (
    <InnerBox>
      <ImgButton src={src} />
      <FormControl sx={{ m: 1, minWidth: "80%" }}>
        <InputLabel id="piece-num-label">피스 수</InputLabel>
        <PieceSelect
          labelId="piece-num-label"
          label="피스 수"
          value={pieceNum}
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
    </InnerBox>
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
