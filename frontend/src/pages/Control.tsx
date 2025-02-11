import useData from "../hooks/useData";

const Control = () => {
  const { data, error } = useData<{
    elevation: number;
    velocity: number;
    voltage: number;
    current: number;
  }>("http://localhost:3001/api/stream");

  return (
    <div>
      <p>{data?.elevation || "N/A"}</p>
      <p>{data?.velocity || "N/A"}</p>
      <p>{data?.voltage || "N/A"}</p>
      <p>{data?.current || "N/A"}</p>
      <p>{error}</p>
    </div>
  );
};

export default Control;
