import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import io from "socket.io-client";

import "./Chat.css";

export const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");
  const user2Id = searchParams.get("user2Id");

  const roomName = [userId, user2Id].sort().join("");

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("load-messages", (loadedMessages) => {
      setMessages(loadedMessages);
    });

    socket.on("new-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.emit("join-chat", roomName);

    return () => {
      socket.off("load-messages");
    };
  }, [socket, roomName]);

  const handleSendMessage = () => {
    if (messageText.trim() === "") return;

    socket.emit("send-message", roomName, messageText);

    setMessageText("");
  };

  //   const getRoomName = (userId, user2Id) => {
  //     const sortedIds = [userId, user2Id].sort().join("");
  //     return `room:${sortedIds}`;
  //   };

  return (
    <div className="chat">
      <div className="chat _container">
        <div className="chat-content">
          <div>
            {messages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
          <div className="chat-row">
            <input
              className="chat-input"
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Ваше сообщение"
            />
            <button className="chat-send-button" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
