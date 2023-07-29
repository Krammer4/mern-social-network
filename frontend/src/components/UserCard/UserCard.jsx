import React, { useEffect } from "react";

import "./UserCard.css";

import anonymus from "../../../../frontend/src/img/Profile/none-avatar.png";

export const UserCard = ({ name, avatar, lastName, username }) => {
  useEffect(() => {
    console.log(avatar);
  });

  return (
    <div className="user-card">
      <div className="user-card-content">
        <div className="user-card-row">
          <div className="user-card-group">
            {avatar ? (
              <img
                className="user-card-avatar"
                src={`http://localhost:5000/${avatar}`}
                alt="avatar"
              />
            ) : (
              <img className="user-card-avatar" src={anonymus} alt="avatar" />
            )}
            <div>
              <p className="user-card-name">
                {name} {lastName}
              </p>
              <p className="user-card-username">@{username}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
