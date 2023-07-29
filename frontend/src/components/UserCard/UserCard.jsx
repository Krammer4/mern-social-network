import React from "react";

import "./UserCard.css";

export const UserCard = ({ name }) => {
  return <div className="user-card">{name}</div>;
};
