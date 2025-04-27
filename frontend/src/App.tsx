import { lazy, Suspense } from "react";
import "./App.css";
import { Angles, State } from "./lib/definitions";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import useKeepAlive from "./hooks/useKeepAlive";
import { useSnackbarHandler } from "./hooks/useSnackbarHandler";
import useWebSocket from "./hooks/useWebSocket";

import { useWebSocketStore } from "./store";

import SuspenseLoading from "./components/SuspenseLoading";
import { WS_BASE_URL } from "./lib/consts";

const Home = lazy(() => import("./pages/Home"));
const Control = lazy(() => import("./pages/Control"));
const Viewer = lazy(() => import("./pages/Viewer"));

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `${
    isActive ? "text-indigo-800" : "text-indigo-400"
  } nav-link hover:text-indigo-900 transition-all`;

function App() {
  const { setCurrentState, addMessage, setAngles } = useWebSocketStore();

  const {
    handleClose,
    handleError,
    handleConnectionError,
    handleOpen,
    handleStart,
    // showMessage,
  } = useSnackbarHandler();

  const handleTelemetryExtras = (state: State, angels: Angles) => {
    setCurrentState(state);
    setAngles(angels);
  };

  const { reconnect, sendCommand } = useWebSocket({
    url: WS_BASE_URL,
    onTelemetryExtras: handleTelemetryExtras,
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
            <NavLink className={navLinkClassName} to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className={navLinkClassName} to={"/control"}>
              Control
            </NavLink>
          </li>
          <li>
            <NavLink className={navLinkClassName} to={"/viewer"}>
              Viewer
            </NavLink>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<SuspenseLoading />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/control"
          element={
            <Suspense fallback={<SuspenseLoading />}>
              <Control reconnect={reconnect} sendCommand={sendCommand} />
            </Suspense>
          }
        />
        <Route
          path="/viewer"
          element={
            <Suspense fallback={<SuspenseLoading />}>
              <Viewer />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
