import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHttp } from "../../hooks/httpHook";
import { PostCard } from "../../components/PostCard/PostCard";
import "./ProfilePage.css";
import anonymus from "../../img/Profile/none-avatar.png";
import { Link, useParams } from "react-router-dom";
import { PostSkeleton } from "../../components/PostSkeleton";
import photo from "../../img/Profile/photo.png";
import edit from "../../img/Profile/edit.png";
import changeAvatar from "../../img/Profile/changeAvatar.png";

export const ProfilePage = () => {
  const { userId } = useParams();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { request, error, loading } = useHttp();
  const [userInformation, setUserInformation] = useState({});
  // const [titleInputValue, setTitleInputValue] = useState("");
  // const [contentInputValue, setContentInputValue] = useState("");
  const filePickerRef = useRef(null);
  const avatarChangeRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const filePickerClick = () => {
    filePickerRef.current.click();
  };

  const [form, setForm] = useState({
    title: "",
    content: "",
    author: userData.userId,
    image: null,
  });

  const changeFormHandler = async (event) => {
    const name = event.target.name;
    const value = name === "image" ? event.target.files[0] : event.target.value;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));

    if (name === "image" && event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById("selected-image").src = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const publishPostHandler = async () => {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("author", form.author);
    formData.append("image", form.image);

    try {
      const data = await request(
        "http://localhost:5000/api/posts",
        "POST",
        formData
        // { "Content-Type": "multipart/form-data" }
      );

      console.log(data);
      window.location.reload();
    } catch (error) {}
  };

  const [userPosts, setUserPosts] = useState([]);

  const fetchUserPosts = useCallback(async () => {
    const data = await request(
      `http://localhost:5000/api/profile/${userId}`,
      "GET"
    );
    setUserPosts(data.posts.reverse());
    setUserInformation(data);
  }, []);

  const fetchUserInformation = useCallback(async () => {
    const data = await request(
      `http://localhost:5000/api/profile/${userData.userId}`,
      "GET"
    );
    setUserInformation(data);
    if (data) {
      console.log(userInformation);
    }
  }, []);

  const changeAvatarHandler = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const form = new FormData();
        form.append("userId", userData.userId);
        form.append("avatar", file);

        const avatarResponse = await request(
          `http://localhost:5000/api/update-avatar`,
          "POST",
          form
        );
        // window.location.reload();
        fetchUserPosts();
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  const avatarClick = () => {
    avatarChangeRef.current.click();
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  return (
    <div className="profile">
      <div className="profile _container">
        <div className="profile-infoBlock">
          <div className="profile-info-row">
            {userInformation.avatar ? (
              <div
                className={`${
                  userData.userId == userId
                    ? "avatar-myProfile"
                    : "avatar-block"
                }`}
                onClick={() => {
                  if (userData.userId == userId) {
                    avatarClick();
                  }
                }}
              >
                <img
                  onClick={() => {
                    if (userData.userId == userId) {
                      console.log("USER ID", userId);
                      console.log("USER DATA . ID: ", userData.userId);
                      avatarClick();
                    }
                  }}
                  src={`http://localhost:5000/${userInformation.avatar}`}
                  className={`profile-info-avatar ${
                    userData.userId == userId && "myProfile"
                  }`}
                />

                <img
                  className="profile-change-avatar-icon"
                  src={changeAvatar}
                />
              </div>
            ) : (
              <img
                onClick={() => {
                  if (userData.userId == userId) {
                    avatarClick();
                  }
                }}
                src={anonymus}
                className={`profile-info-avatar ${
                  userData.userId == userId && "myProfile"
                } anonym`}
              />
            )}

            <div>
              <input
                ref={avatarChangeRef}
                type="file"
                name="avatar"
                onChange={changeAvatarHandler}
                className="avatarInitialPicker"
                accept="image/*"
              />
              <div className="profile-info-name-row">
                <h2 className="profile-info-name">
                  {userInformation.name} {userInformation.lastName} •{" "}
                  {userInformation.username}{" "}
                </h2>
                {userData.userId == userId && (
                  <img
                    className="profile-info-editSign"
                    src={edit}
                    onClick={() => setIsEditing((prev) => !prev)}
                  />
                )}
              </div>

              <p className="profile-info-email">{userInformation.email}</p>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="profile-editing-block">
            <h1 className="profile-editing-title">Редактировать профиль</h1>
          </div>
        )}

        {userId == userData.userId && (
          <div className="profile-publish-block">
            <h1 className="profile-publish-title">Опубликовать новый пост:</h1>
            <input
              type="text"
              name="title"
              placeholder="Название поста"
              className="profileInput"
              onChange={changeFormHandler}
            />
            <textarea
              rows={4}
              type="text"
              name="content"
              placeholder="Описание поста"
              className="profileInput"
              onChange={changeFormHandler}
            />

            <div className="filePickRow">
              <div className="filePickerPhoto-row">
                <img
                  src={photo}
                  className="filePickerPhoto-icon"
                  onClick={filePickerClick}
                />
                <p className="filePickerPhoto-text" onClick={filePickerClick}>
                  Прикрепить картинку
                </p>
              </div>
              <input
                type="file"
                ref={filePickerRef}
                name="image"
                className="filePickerInitialInput"
                accept="image/*"
                onChange={changeFormHandler}
              />

              {form.image && (
                <img src="" className="selected-image" id="selected-image" />
              )}
            </div>
            <button
              className="profile-publish-button"
              onClick={publishPostHandler}
            >
              Опубликовать
            </button>
            <p className="profile-error-message">
              {error && `Пожалуйста, заполните все поля.`}
            </p>
          </div>
        )}

        <div className="profile-allposts-block">
          {userId == userData.userId ? (
            <h1 className="profile-allposts-title">Все ваши посты:</h1>
          ) : (
            <h1 className="profile-allposts-title">
              Все посты {userInformation.username}
            </h1>
          )}

          {loading ? (
            <>
              <div className="blog-post-skeleton">
                <PostSkeleton />
              </div>
              <div className="blog-post-skeleton">
                <PostSkeleton />
              </div>
            </>
          ) : userPosts.length == 0 ? (
            <p className="profile-noPosts">Здесь пока еще нет постов...</p>
          ) : (
            userPosts.map((userPost) => {
              return (
                <>
                  <Link
                    className="postcard-redirectToThisPost"
                    to={`/post/${userPost._id}`}
                  >
                    <PostCard
                      title={userPost.title}
                      authorName={userInformation.name}
                      authorLastName={userInformation.lastName}
                      username={userInformation.username}
                      content={userPost.content}
                      postId={userPost._id}
                      authorEmail={userPost.email}
                      date={userPost.date}
                      userId={userData.userId}
                      authorId={userInformation._id}
                      postImage={userPost.imageUrl}
                      userAvatar={userInformation.avatar}
                    />
                  </Link>
                </>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
