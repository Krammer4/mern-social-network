import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import io from "socket.io-client";
import { useHttp } from "../../hooks/httpHook";

import "./Chat.css";
import { MessageCard } from "../../components/MessageCard/MessageCard";

export const Chat = () => {
  const { request, error, message } = useHttp();
  const [socket, setSocket] = useState(null);
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");
  const user2Id = searchParams.get("user2Id");

  const roomName = [userId, user2Id].sort().join("");

  const fetchUserData = async () => {
    try {
      const userData = await request(
        `http://localhost:5000/api/user/${userId}`,
        "GET"
      );
      setUserData(userData);
    } catch (error) {
      console.error("Error while fetching user data: ", error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
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
      const load = loadedMessages.map((message) => {
        JSON.parse(message);
        setMessages((prev) => [...prev, JSON.parse(message)]);
      });
      // setMessages((prev) => [...prev, ...load]);
      console.log("LOADED MESSAGES: ", loadedMessages);
      if (messages) {
        console.log(messages);
      }
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
    const message = {
      text: messageText,
      user: userData,
      date: new Date(),
    };
    console.log("ALL MESSAGES: ", messages);
    socket.emit("send-message", roomName, message);

    setMessageText("");
  };

  return (
    <div className="chat">
      <div className="chat _container">
        <div className="chat-content">
          <div>
            {messages.length != 0 &&
              messages.map(
                (message, index) =>
                  message.user && (
                    <MessageCard
                      text={message.text}
                      userAvatar={message.user.avatar}
                      authorId={message.user._id}
                      date={message.date}
                    />
                  )
              )}
          </div>

          <div className="chat-row">
            <input
              className="chat-input"
              type="text"
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
              }}
              placeholder="Ваше сообщение"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
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
