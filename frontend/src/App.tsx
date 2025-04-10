import { lazy, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { useSnackbarHandler } from "./hooks/useSnackbarHandler";
import useWebSocket from "./hooks/useWebSocket";
import { Message, Telemetry } from "./lib/definitions";
import Viewer from "./pages/Viewer";
import useKeepAlive from "./hooks/useKeepAlive";
import Control from "./pages/Control";
import { formatDateTime } from "./lib/utils";

const Home = lazy(() => import("./pages/Home"));
// const Control = lazy(() => import("./pages/Control"));

function App() {
  const {
    handleClose,
    handleError,
    handleConnectionError,
    handleOpen,
    handleStart,
    showMessage,
  } = useSnackbarHandler();

  const [messages, setMessages] = useState<Message[]>([
    {
      message: "Application ready",
      severity: 1,
      time: formatDateTime(new Date()),
    },
  ]);

  const insertMessage = (message: string, severity = 5) => {
    setMessages((messages) => [
      ...messages,
      { message, severity, time: formatDateTime(new Date()) },
    ]);
  };

  const { data, error, isLoading, reconnect, sendCommand, isFaultConfirmed } =
    useWebSocket<Telemetry>({
      url: "ws://localhost:6789",
      // onTelemetryMessage: handleTelemetryMessage,
      onMessage: insertMessage,
      onConnectionError: handleConnectionError,
      onError: handleError,
      onOpen: handleOpen,
      onStart: handleStart,
      onClose: handleClose,
    });

  useKeepAlive({ sendCommand, isFaultConfirmed });

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
              messages={messages}
            />
          }
        />
        <Route
          path="/viewer"
          element={<Viewer elevation={data?.elevation || 0} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
