import useIntervalIdStore from "../store";
import { sendRandomData } from "../utils/utils";

const Packet = () => {
  const { intervalId, setIntervalId } = useIntervalIdStore();

  const handleClick = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      return;
    }

    setIntervalId(setInterval(sendRandomData, 300));
  };

  return (
    <div>
      <button onClick={handleClick}>{intervalId ? "Stop" : "Start"}</button>
    </div>
  );
};

export default Packet;
