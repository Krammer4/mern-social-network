import React, { useEffect, useRef, useState } from "react";
import { useHttp } from "../../hooks/httpHook";
import { useParams } from "react-router-dom";
import "./PostPage.css";
import { PostCard } from "../../components/PostCard/PostCard.tsx";
import { CommentCard } from "../../components/CommentCard/CommentCard";
import { PostSkeleton } from "../../components/PostSkeleton";
import { SuccessMessage } from "../../Messages/SuccessMessage/SuccessMessage";
import { WarningMessage } from "../../Messages/WarningMessage/WarningMessage";
import { backend_url } from "../../consts";

export const PostPage = () => {
  const userInfo = JSON.parse(localStorage.getItem("userData"));
  const userId = userInfo.userId;
  const commentInputRef = useRef();
  const [userData, setUserData] = useState({});

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
    const data = await request(`${backend_url}/api/post/${postId}`, "GET");

    setPost(data);
  };

  const fetchUserPosts = async (userId) => {
    try {
      const userData = await request(
        `${backend_url}/api/profile/${userId}`,
        "GET"
      );

      setUserData(userData);
    } catch (error) {
      console.log("Error while fetching UserData: ", userData);
    }
  };

  const publishComment = async () => {
    const publishCommentData = await request(
      `${backend_url}/api/post/${postId}`,
      "POST",
      { ...form }
    );

    fetchPostById();
    commentInputRef.current.value = "";
    showSuccessMessage("Комментарий успешно опубликован");
  };

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchPostById();
    fetchUserPosts(userId);
  }, []);

  useEffect(() => {
    if (Object.keys(userData).length !== 0) {
      console.log(userData);
      if (userData.likedPosts.includes(postId)) {
        setIsLiked(true);
        console.log(userData.likedPosts.includes(postId));
      }
    }
  }, [userData]);

  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

  const [warningMessage, setWarningMessage] = useState("");
  const [isWarningMessageVisible, setIsWarningMessageVisible] = useState(false);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setIsSuccessMessageVisible(true);
    setTimeout(() => {
      setIsSuccessMessageVisible(false);
      setSuccessMessage("");
    }, 3000);
  };

  const showWarningMessage = (message) => {
    setWarningMessage(message);
    setIsWarningMessageVisible(true);
    setTimeout(() => {
      setIsWarningMessageVisible(false);
      setWarningMessage("");
    }, 3000);
  };

  return (
    <div className="postPage">
      {isSuccessMessageVisible && <SuccessMessage message={successMessage} />}
      {isWarningMessageVisible && <WarningMessage message={warningMessage} />}
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
                isRoute={false}
                // handleUnlike={handleUnlike}
                // handleLike={handleLike}
                showSuccessMessage={showSuccessMessage}
                isLikeAvailible={true}
                showWarningMessage={showWarningMessage}
                isLiked={isLiked}
                setIsLiked={setIsLiked}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                publishComment();
              }
            }}
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
          {post.comments && post.comments.length === 0 && (
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
