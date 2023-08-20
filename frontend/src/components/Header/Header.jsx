import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

import "./Header.css";
import settings from "../../img/Profile/settings.png";
import { useSelector } from "react-redux";

export const Header = ({ isAuthentificated }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const makeLogout = async () => {
    auth.logout();
    navigate("/");
  };
  const navigation = useNavigate();
  const profileLinkClick = () => {
    navigation(`/profile/${userData.userId}`);
    window.location.reload();
  };

  const requestsQuantity = useSelector(
    (state) => state.requests.requests.length
  );

  return (
    <nav className="header">
      <div className="header _container">
        <div className="header-content">
          <div className="header-row">
            <div className="header-left-part">
              <NavLink to="/" className="header-link">
                Главная
              </NavLink>
              {isAuthentificated && (
                <>
                  <NavLink to="/users" className="header-link">
                    Пользователи
                  </NavLink>
                  <NavLink to="/music" className="header-link">
                    Музыка
                  </NavLink>
                  <div
                    className={`${
                      requestsQuantity !== 0
                        ? "header-friends-group"
                        : "header-friends"
                    }`}
                  >
                    <NavLink to="/friends" className="header-link">
                      Друзья
                    </NavLink>
                    {requestsQuantity !== 0 && (
                      <p className="header-request-quantity">
                        {requestsQuantity}
                      </p>
                    )}
                  </div>
                  <NavLink to="/notes" className="header-link">
                    Уведомления
                  </NavLink>
                </>
              )}
            </div>
            {isAuthentificated ? (
              <div className="header-group">
                <NavLink
                  to={`/profile/${userData.userId}`}
                  className="header-link"
                  onClick={profileLinkClick}
                >
                  Профиль
                </NavLink>
                <p onClick={makeLogout} className="header-link exit">
                  Выйти
                </p>
                <Link to={`/settings/${userData.userId}`}>
                  <img className="header-link settingsLink" src={settings} />
                </Link>
              </div>
            ) : (
              <div className="header-group">
                <Link to="/" className="header-link">
                  Войти
                </Link>
                <Link to="/registration" className="header-link">
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
