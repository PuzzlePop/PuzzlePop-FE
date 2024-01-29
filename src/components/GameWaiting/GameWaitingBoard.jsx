import styled from "styled-components";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";

export default function GameWaitingBoard(props) {
  const { data, allowedPiece } = props;

  return (
    <Wrapper container>
      <ColGrid xs={8}>
        <Grid></Grid>
      </ColGrid>
      <ColGrid xs={4}></ColGrid>
    </Wrapper>
  );
}

const Wrapper = styled(Grid)`
  width: 950px;
  padding: 3%;
  margin: 5% auto;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 2%;
`;

const ColGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
`;
