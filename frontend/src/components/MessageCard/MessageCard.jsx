import React from "react";
import "./MessageCard.css";
import formatDate from "../../utils/formatDate";
import { Link } from "react-router-dom";
import { backend_url } from "../../consts";

export const MessageCard = ({ text, userAvatar, authorId, date }) => {
  const userStorageData = JSON.parse(localStorage.getItem("userData"));
  const userId = userStorageData.userId;

  const isMyMessage = userId == authorId;

  return (
    <div className={`message ${isMyMessage ? "mine" : ""}`}>
      <Link className="message-userAvatar" to={`/profile/${authorId}`}>
        <img
          className="message-userAvatar"
          src={`${backend_url}/${userAvatar}`}
        />
      </Link>
      <div className="message-card">
        <div className="message-content">
          <p className="message-text">{text}</p>
          <p className="message-date">{formatDate(date)}</p>
        </div>
      </div>
    </div>
  );
};
