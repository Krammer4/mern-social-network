import React, { useCallback, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

import "./Header.css";
import { useHttp } from "../../hooks/httpHook";

export const Header = ({ isAuthentificated }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { request, error, loading } = useHttp();

  const makeLogout = async () => {
    auth.logout();
    navigate("/");
  };
  const navigation = useNavigate();
  const profileLinkClick = () => {
    navigation(`/profile/${userData.userId}`);
    window.location.reload();
  };

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
