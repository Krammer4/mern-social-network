import React, { useContext, useState } from "react";
import "./LoginPage.css";
import { Link } from "react-router-dom";
import { useHttp } from "../../hooks/httpHook";
import { useAuth } from "../../hooks/authHook";
import { AuthContext } from "../../context/authContext";
import { backend_url } from "../../consts";

export const LoginPage = () => {
  const auth = useContext(AuthContext);
  const { request, loading, error } = useHttp();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const changeFormHandler = async (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const loginHandler = async () => {
    try {
      const data = await request(`${backend_url}/api/auth/login`, "POST", {
        ...form,
      });

      auth.login(data.token, data.userId);
    } catch (e) {}
  };

  return (
    <div className="wrapper">
      <div className="auth">
        <div className="auth _container">
          <div className="auth-content">
            <div className="auth-card">
              <div className="auth-card-content">
                <h1 className="auth-mainTitle">Войти</h1>

                <input
                  className="auth-input"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Введите почту"
                  onChange={changeFormHandler}
                />
                <input
                  className="auth-input"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Введите пароль"
                  onChange={changeFormHandler}
                />
                <button className="auth-button" onClick={loginHandler}>
                  Войти
                </button>
                <p className="auth-error">{error}</p>
                <Link to="/registration" className="reg-redirect">
                  У вас еще нет аккаунта? Зарегистрироваться.
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
