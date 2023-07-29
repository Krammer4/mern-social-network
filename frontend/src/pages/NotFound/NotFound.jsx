import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

export const NotFound = () => {
  return (
    <div className="notFound">
      <div className="notFound _container">
        <h2 className="notFound-title">Упс! Страница не найдена!</h2>
        <h1 className="notFoundError">404</h1>
        <p className="notFound-redirect">
          Попробуйте перейти&nbsp;
          <Link to="/" className="notFound-home">
            На главную
          </Link>
        </p>
      </div>
    </div>
  );
};
