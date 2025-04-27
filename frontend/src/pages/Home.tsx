import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col">
      <h1 className="text-6xl font-bold">
        Hyperloop <span className="text-indigo-800">UPV</span>
      </h1>
      <h2 className="mt-6 mb-20 text-3xl">Final project of course</h2>
      <div className="flex gap-20">
        <NavLink
          className="text-lg nav-link text-indigo-500 hover:text-indigo-800 transition-all"
          to="/control"
        >
          Control <span className="nav-link__arrow text-3xl">→</span>
        </NavLink>
        <NavLink
          className="text-lg nav-link text-indigo-500 hover:text-indigo-800 transition-all"
          to="/viewer"
        >
          Viewer <span className="nav-link__arrow text-3xl">→</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Home;
