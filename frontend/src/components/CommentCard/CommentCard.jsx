import React from "react";
import formatDate from "../../utils/formatDate";
import anonymus from "../../img/Profile/none-avatar.png";
import "./CommentCard.css";
import { useHttp } from "../../hooks/httpHook";
import { Link } from "react-router-dom";

export const CommentCard = ({
  content,
  authorEmail,
  authorLastName,
  authorName,
  username,
  date,
  authorId,
  userId,
  commentId,
  postId,
  fetchPostById,
  authorAvatar,
}) => {
  const { request, error, loading } = useHttp();
  const deleteComment = async () => {
    const deleteData = await request(
      `http://localhost:5000/api/post/${postId}/comment/${commentId}`,
      "DELETE"
    );

    // window.location.reload();
    fetchPostById();
  };

  return (
    <div className="commentcard">
      <div className="commentcard-content">
        <div className="commentcard-author-info">
          <div className="commentcard-authpr-group">
            {authorAvatar ? (
              <img
                src={`http://localhost:5000/${authorAvatar}`}
                className="commentcard-author-avatar"
              />
            ) : (
              <img className="commentcard-author-avatar" src={anonymus} />
            )}

            <div>
              <Link
                to={`/profile/${authorId}`}
                className="commentcard-author-name"
              >
                {username}{" "}
                {authorName ? `(${authorName} ${authorLastName})` : `Я`}
              </Link>
              <p className="commentcard-date">{formatDate(date)}</p>
            </div>
          </div>
          <p className="commentcard-author-email">{authorEmail}</p>
        </div>

        <p className="commentcard-postContent">{content}</p>
        {userId === authorId && (
          <p className="commentcard-deleteComment" onClick={deleteComment}>
            Удалить
          </p>
        )}
      </div>
    </div>
  );
};
