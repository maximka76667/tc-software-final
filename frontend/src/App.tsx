import { lazy } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { useSnackbarHandler } from "./hooks/useSnackbarHandler";
import useWebSocket from "./hooks/useWebSocket";
import Viewer from "./pages/Viewer";
import useKeepAlive from "./hooks/useKeepAlive";
import { useWebSocketStore } from "./store";

const Home = lazy(() => import("./pages/Home"));
const Control = lazy(() => import("./pages/Control"));

function App() {
  const { setCurrentState, addMessage } = useWebSocketStore();

  const {
    handleClose,
    handleError,
    handleConnectionError,
    handleOpen,
    handleStart,
    // showMessage,
  } = useSnackbarHandler();

  const { reconnect, sendCommand } = useWebSocket({
    url: "ws://localhost:6789",
    onTelemetryData: (state) => setCurrentState(state),
    onMessage: addMessage,
    onConnectionError: handleConnectionError,
    onError: handleError,
    onOpen: handleOpen,
    onStart: handleStart,
    onClose: handleClose,
  });

  useKeepAlive({ sendCommand });

  return (
    <Router>
      <nav className="flex justify-center m-5 mb-10">
        <ul className="flex gap-10">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to={"/control"}>Control</NavLink>
          </li>
          <li>
            <NavLink to={"/viewer"}>Viewer</NavLink>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/control"
          element={<Control reconnect={reconnect} sendCommand={sendCommand} />}
        />
        <Route path="/viewer" element={<Viewer />} />
      </Routes>
    </Router>
  );
}

export default App;
