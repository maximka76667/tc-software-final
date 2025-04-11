import { memo, useEffect, useRef } from "react";
import { Command, Message, State, States, Telemetry } from "../lib/definitions";
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
  currentState: State;
}

const statesButtons: States = {
  initial: ["precharge"],
  precharging: [],
  precharged: ["discharge", "start levitation"],
  levitating: [],
  levitated: ["stop levitation"],
  levitation_stopping: [],
  discharging: [],
};

const Control = ({
  data,
  isLoading,
  error,
  // reconnect,
  sendCommand,
  messages,
  currentState,
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
            <span className="text-red-700 font-medium">Offline</span>
          ) : isLoading ? (
            <span className="text-gray-700 font-medium">Connecting...</span>
          ) : (
            <span className="text-green-700 font-medium">Online</span>
          )}
        </p>

        {/* Reconnect block */}
        {error && (
          <div className="text-center mt-2">
            <p>Connection lost. Try to reconnect</p>
            {/* <button className="mt-4" onClick={() => reconnect()}>
              Retry
            </button> */}
          </div>
        )}

        <div className="flex flex-wrap mt-8 w-full justify-center gap-2">
          {commands.map((command) => (
            <button
              disabled={
                isLoading ||
                error ||
                !statesButtons[currentState].includes(command as Command)
              }
              className="w-1/3"
              onClick={() => sendCommand(command)}
            >
              {capitalizeWords(command)}
            </button>
          ))}
        </div>

        <p className="text-center m-10">
          Current state:{" "}
          <span className="text-stone-900 font-medium">
            {capitalizeWords(currentState)}
          </span>
        </p>

        <div
          ref={messageEndRef}
          className="message-box px-6 py-4 mt-10 rounded-3xl mx-8 h-[300px] overflow-y-scroll"
        >
          {messages.map(({ message, severity, time }) => (
            <p className="m-1">
              <span className="text-gray-500">{`[${time}]`}</span>
              {" → "}
              <span
                className={`message-severity-${severity} font-medium`}
              >{`${message}`}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(Control);
