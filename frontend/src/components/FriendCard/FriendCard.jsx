import React from "react";
import "./FriendCard.css";

export const FriendCard = () => {
  return (
    <div className="friend-card">
      <div className="friend-card-content">
        <div className="friend-card-row">
          <div className="friend-card-group">
            {request.avatar ? (
              <img
                className="friend-card-avatar"
                src={`${backend_url}/${request.avatar}`}
                alt="avatar"
              />
            ) : (
              <img className="friend-card-avatar" src={anonymus} alt="avatar" />
            )}
            <div>
              <p className="friend-card-name">
                {request.name} {request.lastName}
              </p>
              <p className="friend-card-username">@{request.username}</p>

              {request.town ? (
                <p className="friend-card-town">{request.town}</p>
              ) : request.status ? (
                <p className="friend-card-status">
                  {request.status.slice(0, 40)}...
                </p>
              ) : null}
            </div>
          </div>
          <button
            onClick={() => acceptRequest(request._id)}
            className="friend-accept"
          >
            Принять заявку
          </button>
        </div>
      </div>
    </div>
  );
};
