import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider } from "@mui/styled-engine";
import { RecoilRoot } from "recoil";
import { PuzzleConfigProvider } from "./hooks/usePuzzleConfig";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StyledEngineProvider injectFirst>
    <BrowserRouter>
      <RecoilRoot>
        <PuzzleConfigProvider>
          <App />
        </PuzzleConfigProvider>
      </RecoilRoot>
    </BrowserRouter>
  </StyledEngineProvider>,
);
