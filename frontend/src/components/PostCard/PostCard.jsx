import React from "react";
import "./PostCard.css";
import formatDate from "../../utils/formatDate";
import anonymus from "../../img/Profile/none-avatar.png";
import { useHttp } from "../../hooks/httpHook";
import { Link, useNavigate } from "react-router-dom";

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

  return (
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
  );
};
