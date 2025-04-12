import React, { memo } from "react";
import { useWebSocketStore } from "../../store";
import { useShallow } from "zustand/react/shallow";

const StatusBox = () => {
  const { error, isLoading } = useWebSocketStore(
    useShallow((state) => ({
      error: state.error,
      isLoading: state.isLoading,
    }))
  );

  return (
    <p className="text-center">
      Status:{" "}
      {error ? (
        <span className="text-red-700 font-medium">Offline</span>
      ) : isLoading ? (
        <span className="text-gray-700 font-medium">Connecting...</span>
      ) : (
        <span className="text-green-700 font-medium">Online</span>
      )}
    </p>
  );
};

export default memo(StatusBox);
