import { useWebSocketStore } from "../../store";
import { capitalizeWords } from "../../lib/utils";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";

const CurrentState = () => {
  const { currentState } = useWebSocketStore(
    useShallow((state) => ({
      currentState: state.currentState,
    }))
  );

  return (
    <p className="text-center m-10">
      Current state:{" "}
      <span className="text-stone-900 font-medium">
        {capitalizeWords(currentState)}
      </span>
    </p>
  );
};

export default memo(CurrentState);
