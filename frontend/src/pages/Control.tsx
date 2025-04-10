import { memo, useEffect, useRef } from "react";
import { Message, Telemetry } from "../lib/definitions";
import Charts from "../components/Charts";
import { capitalizeWords } from "../lib/utils";
import { commands } from "../lib/consts";
import "../components/MessagesBox.css";

interface ControlProps {
  data: Telemetry | null;
  error: boolean;
  isLoading: boolean;
  reconnect: () => void;
  sendCommand: (message: string) => void;
  messages: Message[];
}

const Control = ({
  data,
  isLoading,
  error,
  reconnect,
  sendCommand,
  messages,
}: ControlProps) => {
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex w-full">
      <div className="w-3/5">
        <Charts data={data as unknown as { [key: string]: number }} />
      </div>

      <div className="w-2/5 sticky top-0 h-[500px] py-15">
        <p className="text-center">
          Status:{" "}
          {error ? (
            <span style={{ color: "red" }}>Offline</span>
          ) : isLoading ? (
            <span style={{ color: "grey" }}>Connecting...</span>
          ) : (
            <span style={{ color: "green" }}>Online</span>
          )}
        </p>

        {/* Reconnect block */}
        {error && (
          <div className="text-center m-2">
            <p>Connection lost. Try to reconnect</p>
            <button onClick={() => reconnect()}>Retry</button>
          </div>
        )}

        <div className="flex flex-wrap mt-8 w-full justify-center gap-2">
          {commands.map((command) => (
            <button
              disabled={isLoading || error}
              className="w-1/3"
              onClick={() => sendCommand(command)}
            >
              {capitalizeWords(command)}
            </button>
          ))}
        </div>

        <div
          ref={messageEndRef}
          className="message-box px-6 py-4 mt-20 rounded-3xl mx-8 h-[300px] overflow-y-scroll"
        >
          {messages.map(({ message, severity, time }) => (
            <p className="m-1">
              <span className="text-gray-500">{`[${time}]`}</span>
              {" → "}
              <span
                className={`message-severity-${severity} `}
              >{`${message}`}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(Control);
