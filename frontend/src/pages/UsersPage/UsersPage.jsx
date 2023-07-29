import React, { useEffect, useState } from "react";
import { useHttp } from "../../hooks/httpHook";
import { UserCard } from "../../components/UserCard/UserCard";

import "./UsersPage.css";

export const UsersPage = () => {
  const { request, loading, error } = useHttp();
  const [allUsers, setAllUsers] = useState([]);

  const [sortButtons, setSortButtons] = useState([
    {
      title: "алфавиту",
      id: 0,
      sortMethod: "alphabet",
    },
    {
      title: "алфавиту (обратный порядок)",
      id: 1,
      sortMethod: "alphabetReversed",
    },
    {
      title: "дате регистрации (сначала новые)",
      id: 2,
      sortMethod: "reversed",
    },
    {
      title: "дате регистрации (сначала олды)",
      id: 3,
      sortMethod: "",
    },
  ]);
  const [activeSortButton, setActiveSortButton] = useState(null);

  const fetchAllUsers = async (sortMethod) => {
    const data = await request(
      `http://localhost:5000/api/users/${sortMethod}`,
      "GET"
    );
    setAllUsers(data);
  };

  useEffect(() => {
    fetchAllUsers("");
  }, []);

  return (
    <div className="users">
      <div className="users _container">
        <div className="users-sort-row">
          <p className="users-sort-mainTitle">Сортировать по:</p>
          {sortButtons.map((button) => (
            <p
              className={`users-sort-button ${
                activeSortButton == button.id && "active"
              }`}
              onClick={() => {
                setActiveSortButton(button.id);
                fetchAllUsers(button.sortMethod);
              }}
            >
              {button.title}
            </p>
          ))}
        </div>

        {allUsers.length !== 0 ? (
          allUsers.map((user) => {
            return (
              <UserCard
                name={user.name}
                avatar={user.avatar}
                lastName={user.lastName}
                username={user.username}
                userCardId={user._id}
              />
            );
          })
        ) : (
          <h1>No users</h1>
        )}
      </div>
    </div>
  );
};
