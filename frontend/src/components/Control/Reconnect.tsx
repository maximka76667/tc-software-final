import { memo } from "react";
import { useWebSocketStore } from "../../store";
import { useShallow } from "zustand/react/shallow";

const Reconnect = () => {
  const { error, isFaultConfirmed } = useWebSocketStore(
    useShallow((state) => ({
      error: state.error,
      isFaultConfirmed: state.isFaultConfirmed,
    }))
  );

  return (
    <>
      {(error || isFaultConfirmed) && (
        <div className="text-center mt-2">
          <p>Connection lost. Try to reconnect</p>
          {/* <button className="mt-4" onClick={() => reconnect()}>
                Retry
              </button> */}
        </div>
      )}
    </>
  );
};

export default memo(Reconnect);
