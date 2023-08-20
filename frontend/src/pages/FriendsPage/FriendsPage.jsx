import React, { useState, useEffect, createContext } from "react";
import { useDispatch } from "react-redux";
import "./FriendsPage.css";
import { SuccessMessage } from "../../Messages/SuccessMessage/SuccessMessage";
import { useHttp } from "../../hooks/httpHook";
import { backend_url } from "../../consts";

import anonymus from "../../../../frontend/src/img/Profile/none-avatar.png";
import { addRequest } from "../../redux/slices/requestsSlice";

export const FriendsPage = () => {
  const userStorageData = JSON.parse(localStorage.getItem("userData"));

  const { request, loading } = useHttp();
  const [userData, setUserData] = useState(null);
  const [isRequestsVisible, setIsRequestsVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

  const dispatch = useDispatch();

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setIsSuccessMessageVisible(true);
    setTimeout(() => {
      setIsSuccessMessageVisible(false);
      setSuccessMessage("");
    }, 3000);
  };

  const fetchUserData = async () => {
    const userData = await request(
      `${backend_url}/api/user/${userStorageData.userId}`,
      "GET"
    );
    dispatch(addRequest(userData.requests));
    setUserData(userData);
  };

  const acceptRequest = async (requestingUserId) => {
    try {
      const requestAcceptingresult = await request(
        `${backend_url}/api/accept-request`,
        "POST",
        {
          requestedUserId: userStorageData.userId,
          requestingUserId,
        }
      );

      showSuccessMessage(requestAcceptingresult.message);
      fetchUserData();
    } catch (error) {}
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="friends">
      {isSuccessMessageVisible && <SuccessMessage message={successMessage} />}
      <div className="friends _container">
        <div className="friends-content">
          <h1 className="friends-mainTitle">Друзья</h1>
          <p
            className="friends-toggleRequestsVisibility"
            onClick={() => setIsRequestsVisible((prev) => !prev)}
          >
            {isRequestsVisible ? "Скрыть" : "Показать"} запросы в друзья
          </p>
          {isRequestsVisible && userData.requests.length !== 0 && (
            <div className="friends-allRequests">
              {userData &&
                userData.requests &&
                userData.requests.length !== 0 &&
                userData.requests.map((request) => {
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
                              <img
                                className="friend-card-avatar"
                                src={anonymus}
                                alt="avatar"
                              />
                            )}
                            <div>
                              <p className="friend-card-name">
                                {request.name} {request.lastName}
                              </p>
                              <p className="friend-card-username">
                                @{request.username}
                              </p>

                              {request.town ? (
                                <p className="friend-card-town">
                                  {request.town}
                                </p>
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
                })}
            </div>
          )}
          {userData && userData.friends.length !== 0 ? (
            <div className="friend-allFriends">
              {userData.friends.map((friend) => {
                return (
                  <div className="friend-card">
                    <div className="friend-card-content">
                      <div className="friend-card-row">
                        <div className="friend-card-group">
                          {friend.avatar ? (
                            <img
                              className="friend-card-avatar"
                              src={`${backend_url}/${friend.avatar}`}
                              alt="avatar"
                            />
                          ) : (
                            <img
                              className="friend-card-avatar"
                              src={anonymus}
                              alt="avatar"
                            />
                          )}
                          <div>
                            <p className="friend-card-name">
                              {friend.name} {friend.lastName}
                            </p>
                            <p className="friend-card-username">
                              @{friend.username}
                            </p>

                            {friend.town ? (
                              <p className="friend-card-town">{friend.town}</p>
                            ) : friend.status ? (
                              <p className="friend-card-status">
                                {friend.status.slice(0, 40)}...
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="friend-noFriendsMessage">У вас пока нет друзей</p>
          )}
        </div>
      </div>
    </div>
  );
};
