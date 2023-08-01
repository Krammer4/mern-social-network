import React, { useEffect, useState } from "react";
import { useHttp } from "../../hooks/httpHook";
import { UserCard } from "../../components/UserCard/UserCard";

import "./UsersPage.css";
import UserCardSkeleton from "../../components/UserCardSkeleton";

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

  const [inputValue, setInputValue] = useState("");

  const laxUserSearchHandler = async (searchValue) => {
    const searchedUsers = await request(
      `http://localhost:5000/api/laxUserSearch?searchValue=${searchValue}`,
      "GET"
    );

    setActiveSortButton(null);
    setAllUsers(searchedUsers);
  };

  const strictUserSearchHandler = async (searchValue) => {
    if (searchValue.trim() !== "") {
      const searchedUsers = await request(
        `http://localhost:5000/api/strictUserSearch?searchValue=${searchValue}`,
        "GET"
      );

      setAllUsers(searchedUsers);
    }
  };

  const inputChangeHandler = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setTimeout(() => {
      laxUserSearchHandler(value);
    }, 500);
  };

  return (
    <div className="users">
      <div className="users _container">
        <div className="users-content">
          <div className="users-search-row">
            <input
              value={inputValue}
              onChange={inputChangeHandler}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  strictUserSearchHandler(inputValue);
                }
              }}
              className="users-search-input"
            />
            <button
              onClick={() => strictUserSearchHandler(inputValue)}
              className="users-search-button"
            >
              Поиск
            </button>
          </div>
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

          {Array.isArray(allUsers) ? (
            allUsers.length !== 0 ? (
              loading ? (
                <div className="user-card-skeleton">
                  <UserCardSkeleton />
                  <UserCardSkeleton />
                  <UserCardSkeleton />
                </div>
              ) : (
                allUsers.map((user) => {
                  return (
                    <UserCard
                      name={user.name}
                      avatar={user.avatar}
                      lastName={user.lastName}
                      username={user.username}
                      userCardId={user._id}
                      userStatus={user.status}
                      userTown={user.town}
                    />
                  );
                })
              )
            ) : (
              <h1 className="users-noUsers">
                Ни одного пользователя не найдено...
              </h1>
            )
          ) : (
            <p>{allUsers.name}</p>
          )}
        </div>
      </div>
    </div>
  );
};
