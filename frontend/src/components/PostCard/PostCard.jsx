import React, { useEffect, useState } from "react";
import "./PostCard.css";
import formatDate from "../../utils/formatDate";
import anonymus from "../../img/Profile/none-avatar.png";
import { useHttp } from "../../hooks/httpHook";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import filledHeart from "../../img/Post/filledHeart.png";
import unFilledHeart from "../../img/Post/unFilledHeart.png";

export const PostCard = ({
  title,
  authorName,
  authorLastName,
  content,
  postId,
  authorEmail,
  username,
  date,
  userId,
  authorId,
  postImage,
  userAvatar,
  isRoute,
  showSuccessMessage,
  isLikeAvailible,
  showWarningMessage,
  isLiked,
  setIsLiked,
}) => {
  const navigate = useNavigate();
  const { request, error, loading } = useHttp();
  const userData = JSON.parse(localStorage.getItem("userData"));

  const deletePost = async () => {
    const deletePostData = await request(
      `http://localhost:5000/api/post/${postId}`,
      "DELETE"
    );

    navigate(`/profile/${userId}`);
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post("http://localhost:5000/api/like-post", {
        userId: userId,
        postId: postId,
      });

      setIsLiked(true);
      if (response.data.message == "Пост уже лайкнут") {
        showWarningMessage("Пост уже лайкнут");
      } else {
        showSuccessMessage("Пост успешно лайкнут");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/unlike-post",
        {
          userId: userId,
          postId: postId,
        }
      );
      setIsLiked(false);
      showSuccessMessage("Лайк был успешно убран");
    } catch (error) {
      console.error(error);
    }
  };

  return isRoute ? (
    <Link className="postcard-redirectToThisPost" to={`/post/${postId}`}>
      <div className="postcard">
        <div className="postcard-content">
          <div className="postcard-author-info">
            <div className="postcard-authpr-group">
              {userAvatar ? (
                <img
                  src={`http://localhost:5000/${userAvatar}`}
                  className="postcard-author-avatar"
                />
              ) : (
                <img className="postcard-author-avatar" src={anonymus} />
              )}

              <div>
                <Link to={`/profile/${authorId}`}>
                  <p className="postcard-author-name">
                    {username} {`(${authorName} ${authorLastName})`}
                  </p>
                </Link>
                <p className="postcard-date">{formatDate(date)}</p>
              </div>
            </div>
            <p className="postcard-author-email">{authorEmail}</p>
          </div>

          <h3 className="postcard-postTitle">{title}</h3>
          <p className="postcard-postContent">{content}</p>

          {postImage && (
            <img
              className="postcard-postImage"
              src={`http://localhost:5000/${postImage}`}
            />
          )}

          {userId === authorId && (
            <p className="postcard-deletePost" onClick={deletePost}>
              Удалить
            </p>
          )}
        </div>
      </div>
    </Link>
  ) : (
    <div className="postcard">
      <div className="postcard-content">
        <div className="postcard-author-info">
          <div className="postcard-authpr-group">
            {userAvatar ? (
              <img
                src={`http://localhost:5000/${userAvatar}`}
                className="postcard-author-avatar"
              />
            ) : (
              <img className="postcard-author-avatar" src={anonymus} />
            )}

            <div>
              <Link to={`/profile/${authorId}`}>
                <p className="postcard-author-name">
                  {username} {`(${authorName} ${authorLastName})`}
                </p>
              </Link>
              <p className="postcard-date">{formatDate(date)}</p>
            </div>
          </div>
          <p className="postcard-author-email">{authorEmail}</p>
        </div>

        <h3 className="postcard-postTitle">{title}</h3>
        <p className="postcard-postContent">{content}</p>

        {postImage && (
          <img
            className="postcard-postImage"
            src={`http://localhost:5000/${postImage}`}
          />
        )}

        {/* {
          <div>
            {isLiked ? (
              <p onClick={() => handleUnlike(postId)}>Убрать лайк</p>
            ) : (
              <p onClick={() => handleLike(postId)}>Лайк</p>
            )}
          </div>
        } */}

        {isLikeAvailible && (
          <div>
            {isLiked ? (
              <img
                className="postcard-like-icon"
                src={filledHeart}
                onClick={() => handleUnlike(postId)}
              />
            ) : (
              <img
                className="postcard-like-icon"
                src={unFilledHeart}
                onClick={() => handleLike(postId)}
              />
            )}
          </div>
        )}

        {userId === authorId && (
          <p className="postcard-deletePost" onClick={deletePost}>
            Удалить
          </p>
        )}
      </div>
    </div>
  );
};
