import { lazy } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Control = lazy(() => import("./pages/Control"));
const Packet = lazy(() => import("./pages/Packet"));

function App() {
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
          <Route path="/control" element={<Control />} />
          <Route path="/packet" element={<Packet />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
