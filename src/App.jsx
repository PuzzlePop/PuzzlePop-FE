// import "./App.css";
import useSender from "./hooks/useSender";
import { Routes } from "./pages/Routes";

function App() {
  useSender();

  return <Routes />;
}

export default App;
