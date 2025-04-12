import { memo, useEffect, useRef } from "react";
import "../styles/MessagesBox.css";
import { useWebSocketStore } from "../../store";
import { useShallow } from "zustand/react/shallow";

const MessagesBox = () => {
  const { messages } = useWebSocketStore(
    useShallow((state) => ({ messages: state.messages }))
  );
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={messageEndRef}
      className="message-box px-6 py-4 mt-10 rounded-3xl mx-8 h-[300px] overflow-y-scroll"
    >
      {messages.map(({ message, severity, time }) => (
        <p key={time} className="m-1">
          <span className="text-gray-500">{`[${time}]`}</span>
          {" → "}
          <span
            className={`message-severity-${severity} font-medium`}
          >{`${message}`}</span>
        </p>
      ))}
    </div>
  );
};

export default memo(MessagesBox);
