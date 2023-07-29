import React, { useEffect, useState } from "react";
import { useHttp } from "../../hooks/httpHook";
import { UserCard } from "../../components/UserCard/UserCard";

import "./UsersPage.css";

export const UsersPage = () => {
  const { request, loading, error } = useHttp();
  const [allUsers, setAllUsers] = useState([]);

  const fetchAllUsers = async (sortMethod) => {
    const data = await request(
      `http://localhost:5000/api/users/${sortMethod}`,
      "GET"
    );
    setAllUsers(data);
  };

  //   const fetchAllUsersByAlphabet = async () => {
  //     const data = await request(
  //       "http://localhost:5000/api/users/alphabet",
  //       "GET"
  //     );
  //     setAllUsers(data);
  //   };

  //   const fetchAllUsersByAlphabetReversed = async () => {
  //     const data = await request(
  //       "http://localhost:5000/api/users/alphabetReversed",
  //       "GET"
  //     );
  //     setAllUsers(data);
  //   };

  useEffect(() => {
    fetchAllUsers("");
  }, []);

  return (
    <div className="users">
      <div className="users _container">
        <div className="users-sort-row">
          <p>Сортировать по:</p>
          <p
            className="users-sort-button"
            onClick={() => fetchAllUsers("alphabet")}
          >
            алфавиту
          </p>
          <p
            className="users-sort-button"
            onClick={() => fetchAllUsers("alphabetReversed")}
          >
            алфавиту (обратный порядок)
          </p>
          <p className="users-sort-button" onClick={() => fetchAllUsers("")}>
            дате регистрации (сначала олды)
          </p>
        </div>

        {allUsers.length !== 0 ? (
          allUsers.map((user) => {
            return <UserCard name={user.name} />;
          })
        ) : (
          <h1>No users</h1>
        )}
      </div>
    </div>
  );
};
