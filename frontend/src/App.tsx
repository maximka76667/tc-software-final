import { lazy } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { Telemetry } from "./lib/definitions";
import { useTelemetryStore } from "./store";
import { useSnackbarHandler } from "./hooks/useSnackbarHandler";
import useWebSocket from "./hooks/useWebSocket";

const Home = lazy(() => import("./pages/Home"));
const Control = lazy(() => import("./pages/Control"));
const Packet = lazy(() => import("./pages/Packet"));

function App() {
  const {
    addElevation,
    addVelocity,
    addCurrent,
    addVoltage,
    setIsSimulationRunning,
  } = useTelemetryStore();

  const {
    handleClose,
    handleError,
    handleConnectionError,
    handleOpen,
    handleStart,
    showMessage,
  } = useSnackbarHandler();

  const handleTelemetryMessage = (newData: Telemetry) => {
    addVelocity(newData.velocity);
    addVoltage(newData.voltage);
    addCurrent(newData.current);
    addElevation(newData.elevation);
  };

  const handleSimulationChange = (isSimulationRunning: boolean) => {
    setIsSimulationRunning(isSimulationRunning);
  };

  const { data, error, isLoading, reconnect, sendCommand } = useWebSocket({
    url: "ws://localhost:6789",
    onTelemetryMessage: handleTelemetryMessage,
    onMessage: showMessage,
    onConnectionError: handleConnectionError,
    onError: handleError,
    onOpen: handleOpen,
    onStart: handleStart,
    onClose: handleClose,
    onSimulationChange: handleSimulationChange,
  });

  return (
    <Router>
      <div>
        <h1>My React Router App</h1>
        <nav>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to={"/control"}>Control</NavLink>
          </li>
          <li>
            <NavLink to={"/packet"}>Packet</NavLink>
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
          <Route path="/packet" element={<Packet />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
