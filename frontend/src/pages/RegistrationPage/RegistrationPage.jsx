import React, { useState } from "react";
import "./RegistrationPage.css";
import { useHttp } from "../../hooks/httpHook.js";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";

export const RegistrationPage = () => {
  const navigate = useNavigate();
  const { request, loading, error } = useHttp();
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    username: "",
  });

  const changeFormHandler = async (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      const data = await request(
        "http://localhost:5000/api/auth/registration",
        "POST",
        { ...form }
      );
      navigate("/");
      console.log(`DATA Message: ${data.message}`);
    } catch (e) {
      console.log(error);
      console.log(e);
    }
  };

  return (
    <div className="wrapper">
      <div className="auth">
        <div className="auth _container">
          <div className="auth-content">
            <div className="auth-card">
              <div className="auth-card-content">
                <h1 className="auth-mainTitle">Регистрация</h1>
                <input
                  className="auth-input"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Введите ваше имя"
                  onChange={changeFormHandler}
                />
                <input
                  className="auth-input"
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Введите вашу фамилию"
                  onChange={changeFormHandler}
                />
                <input
                  className="auth-input"
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Введите ваше имя пользователя"
                  onChange={changeFormHandler}
                />
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

                <button
                  onClick={registerHandler}
                  disabled={loading}
                  className="auth-button"
                >
                  Зарегистрироваться
                </button>
                <p className="auth-error">{error}</p>
                <Link to="/" className="reg-redirect">
                  Войти в аккаунт
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
