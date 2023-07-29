import React, { useEffect, useRef, useState } from "react";
import { useHttp } from "../../hooks/httpHook";
import { useParams } from "react-router-dom";
import "./PostPage.css";
import { PostCard } from "../../components/PostCard/PostCard";
import { CommentCard } from "../../components/CommentCard/CommentCard";
import { PostSkeleton } from "../../components/PostSkeleton";

export const PostPage = () => {
  const userInfo = JSON.parse(localStorage.getItem("userData"));
  const userId = userInfo.userId;
  const commentInputRef = useRef();

  const [form, setForm] = useState({
    content: "",
    userId,
  });

  const changeFormHandler = async (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const { postId } = useParams();
  const { request, error, loading } = useHttp();
  const [post, setPost] = useState({});

  const fetchPostById = async () => {
    const data = await request(
      `http://localhost:5000/api/post/${postId}`,
      "GET"
    );
    setPost(data);
  };

  const publishComment = async () => {
    const publishCommentData = await request(
      `http://localhost:5000/api/post/${postId}`,
      "POST",
      { ...form }
    );

    // window.location.reload();
    fetchPostById();
    commentInputRef.current.value = "";
  };

  useEffect(() => {
    fetchPostById();
  }, []);

  return (
    <div className="postPage">
      <div className="postPage _container">
        <div className="postPage-postBlock">
          {loading ? (
            <div className="blog-post-skeleton">
              <PostSkeleton />
            </div>
          ) : (
            post.author && (
              <PostCard
                title={post.title}
                content={post.content}
                date={post.date}
                authorName={post.author.name}
                authorLastName={post.author.lastName}
                username={post.author.username}
                postId={post._id}
                userId={userId}
                authorId={post.author._id}
                postImage={post.imageUrl}
                userAvatar={post.author.avatar}
              />
            )
          )}
        </div>
        <div className="postPage-leaveComment-block">
          <h3 className="postPage-leaveComment-title">Оставить комментарий:</h3>
          <textarea
            className="postPage-input"
            name="content"
            type="text"
            placeholder="Текст комментария"
            ref={commentInputRef}
            onChange={changeFormHandler}
          />
          <button
            className="postPage-leaveComment-button"
            onClick={publishComment}
          >
            Опубликовать
          </button>
        </div>

        <div className="postPage-allComments-block">
          <h3 className="postPage-allComments-title">Комментарии к посту:</h3>
          {post.comments && post.comments.length == 0 && (
            <p className="postPage-noComments">
              Здесь пока нет ни одного комментария
            </p>
          )}
          {post.comments &&
            post.comments.map((comment) => {
              return (
                <CommentCard
                  content={comment.content}
                  authorEmail={comment.author.email}
                  date={comment.date}
                  username={comment.author.username}
                  authorLastName={comment.author.lastName}
                  authorName={comment.author.name}
                  userId={userId}
                  authorId={comment.author._id}
                  commentId={comment._id}
                  postId={postId}
                  fetchPostById={fetchPostById}
                  authorAvatar={comment.author.avatar}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};
