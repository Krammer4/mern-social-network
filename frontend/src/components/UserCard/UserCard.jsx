import React, { useEffect } from "react";

import "./UserCard.css";

import anonymus from "../../../../frontend/src/img/Profile/none-avatar.png";
import { Link } from "react-router-dom";
import { backend_url } from "../../consts";

export const UserCard = ({
  name,
  avatar,
  lastName,
  username,
  userCardId,
  userStatus,
  userTown,
}) => {
  useEffect(() => {
    console.log(avatar);
  });

  return (
    <Link className="user-card-redirect" to={`/profile/${userCardId}`}>
      <div className="user-card">
        <div className="user-card-content">
          <div className="user-card-row">
            <div className="user-card-group">
              {avatar ? (
                <img
                  className="user-card-avatar"
                  src={`${backend_url}/${avatar}`}
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

                {userTown ? (
                  <p className="user-card-town">{userTown}</p>
                ) : userStatus ? (
                  <p className="user-card-status">
                    {userStatus.slice(0, 40)}...
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
