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
import { Telemetry } from "./lib/definitions";
import Viewer from "./pages/Viewer";

const Home = lazy(() => import("./pages/Home"));
const Control = lazy(() => import("./pages/Control"));

function App() {
  const {
    handleClose,
    handleError,
    handleConnectionError,
    handleOpen,
    handleStart,
    showMessage,
  } = useSnackbarHandler();

  const { data, error, isLoading, reconnect, sendCommand } =
    useWebSocket<Telemetry>({
      url: "ws://localhost:6789",
      // onTelemetryMessage: handleTelemetryMessage,
      onMessage: showMessage,
      onConnectionError: handleConnectionError,
      onError: handleError,
      onOpen: handleOpen,
      onStart: handleStart,
      onClose: handleClose,
    });

  return (
    <Router>
      <nav className="flex justify-center gap-10 m-5">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to={"/control"}>Control</NavLink>
        </li>
        <li>
          <NavLink to={"/viewer"}>Viewer</NavLink>
        </li>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/control"
          element={
            <Control
              data={data}
              error={error}
              isLoading={isLoading}
              reconnect={reconnect}
              sendCommand={sendCommand}
            />
          }
        />
        <Route path="/viewer" element={<Viewer />} />
      </Routes>
    </Router>
  );
}

export default App;
