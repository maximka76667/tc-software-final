import { memo } from "react";
import { sendRandomData } from "../lib/utils";
import { useIntervalIdStore } from "../store";

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

export default memo(Packet);
