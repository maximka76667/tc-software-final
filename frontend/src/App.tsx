import { lazy } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import useEventSource from "./hooks/useEventSource";
import { Telemetry } from "./lib/definitions";
import { useTelemetryStore } from "./store";
import { useSnackbarHandler } from "./hooks/useSnackbarHandler";

const Home = lazy(() => import("./pages/Home"));
const Control = lazy(() => import("./pages/Control"));
const Packet = lazy(() => import("./pages/Packet"));

function App() {
  const { addElevation, addVelocity, addCurrent, addVoltage } =
    useTelemetryStore();

  const { handleClose, handleError, handleOpen, handleStart } =
    useSnackbarHandler();

  const handleMessage = (newData: Telemetry) => {
    addVelocity(newData.velocity);
    addVoltage(newData.voltage);
    addCurrent(newData.current);
    addElevation(newData.elevation);
  };

  const { data, error, reconnect } = useEventSource<Telemetry>({
    url: "http://localhost:3001/api/stream",
    onMessage: handleMessage,
    onError: handleError,
    onOpen: handleOpen,
    onStart: handleStart,
    onClose: handleClose,
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
              <Control data={data} error={error} reconnect={reconnect} />
            }
          />
          <Route path="/packet" element={<Packet />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
