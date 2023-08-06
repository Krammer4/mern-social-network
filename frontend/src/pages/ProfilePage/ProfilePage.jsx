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
import { SuccessMessage } from "../../Messages/SuccessMessage/SuccessMessage.jsx";
import { motion } from "framer-motion";

import "./ProfilePage.css";
import { MusicCard } from "../../components/MusicCard/MusicCard";

export const ProfilePage = () => {
  const { userId } = useParams();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const isOwnProfile = userId === userData.userId;

  const { request, error, loading } = useHttp();
  const [userInformation, setUserInformation] = useState({});
  // const [titleInputValue, setTitleInputValue] = useState("");
  // const [contentInputValue, setContentInputValue] = useState("");
  const filePickerRef = useRef(null);
  const avatarChangeRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isMyTrack, setIsMyTrack] = useState(false);
  const [isMoreShowed, setIsMoreShowed] = useState(false);
  const [userLikedPosts, setUserLikedPosts] = useState([]);

  // MESSAGES
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

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

  const [userPosts, setUserPosts] = useState([]);

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  const fetchUserPosts = useCallback(async () => {
    const data = await request(
      `http://localhost:5000/api/profile/${userId}`,
      "GET"
    );
    setUserPosts(data.posts.reverse());
    setUserInformation(data);
    setProfileName(data.name);
    setProfileLastName(data.lastName);
    setProfileUsername(data.username);
    setProfileStatus(data.status);
    setProfileTown(data.town);
  }, []);

  const fetchUserLikedPosts = async (userId) => {
    try {
      const userPosts = await request(
        `http://localhost:5000/api/get-user-liked/${userId}`,
        "GET"
      );

      setUserLikedPosts(userPosts);
      console.log("USER LIKED POSTS: ", userPosts);
    } catch (error) {
      console.log("Error while fetching user posts: ", error.message);
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
      );

      fetchUserPosts();
      showSuccessMessage("Пост успешно опубликован!");
    } catch (error) {}
  };

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
        fetchUserPosts();
        showSuccessMessage("Аватар был успешно изменён!");
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
    fetchUserLikedPosts(userId);
    if (isOwnProfile) {
      setIsMyTrack(true);
    }
  }, []);

  // States for profile-editing

  const [profileName, setProfileName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profileUsername, setProfileUsername] = useState("");
  const [profileStatus, setProfileStatus] = useState("");
  const [profileTown, setProfileTown] = useState("");
  const [editingMessage, setEditingMessage] = useState("");

  const editLastNameRef = useRef(null);
  const editUsernameRef = useRef(null);
  const editStatusRef = useRef(null);
  const editTownRef = useRef(null);

  const editFormChangeHandler = async (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // Обновляем состояния в зависимости от имени поля ввода
    if (name === "name") {
      setProfileName(value);
    } else if (name === "lastName") {
      setProfileLastName(value);
    } else if (name === "username") {
      setProfileUsername(value);
    } else if (name === "status") {
      setProfileStatus(value);
    } else if (name === "town") {
      setProfileTown(value);
    }
  };

  const saveProfileData = useCallback(async () => {
    try {
      const formData = {
        name: profileName,
        lastName: profileLastName,
        username: profileUsername,
        status: profileStatus,
        town: profileTown,
      };

      await request(
        `http://localhost:5000/api/update-profile/${userData.userId}`,
        "PATCH",
        formData
      );
      setIsEditing(false);
      fetchUserPosts();
      showSuccessMessage("Информация успешно обновлена!");
    } catch (error) {
      setEditingMessage(error.message);
    }
  }, [
    request,
    userData.userId,
    profileName,
    profileLastName,
    profileUsername,
    profileStatus,
    profileTown,
  ]);

  const saveProfileDataOnKeyPress = (e) => {
    if (e.key == "Enter") {
      saveProfileData();
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setIsSuccessMessageVisible(true);
    setTimeout(() => {
      setIsSuccessMessageVisible(false);
      setSuccessMessage("");
    }, 3000);
  };

  const isProfileClosed =
    !isOwnProfile && userInformation.settings?.isClosedProfile;
  const isMusicClosed =
    !isOwnProfile && userInformation.settings?.isClosedMusic;
  const isLikedClosed =
    !isOwnProfile && userInformation.settings?.isClosedLikes;

  return (
    <div className="profile">
      {isSuccessMessageVisible && <SuccessMessage message={successMessage} />}
      <div className="profile _container">
        <div className="profile-content">
          <div className="profile-infoBlock">
            <div className="profile-info-row">
              {userInformation.avatar ? (
                <div
                  className={`${
                    isOwnProfile ? "avatar-myProfile" : "avatar-block"
                  }`}
                  onClick={() => {
                    if (isOwnProfile) {
                      avatarClick();
                    }
                  }}
                >
                  <img
                    onClick={() => {
                      if (isOwnProfile) {
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
                <div
                  className={`${
                    isOwnProfile ? "avatar-myProfile" : "avatar-block"
                  }`}
                  onClick={() => {
                    if (isOwnProfile) {
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
                    src={anonymus}
                    className={`profile-info-avatar ${
                      userData.userId == userId && "myProfile"
                    }`}
                  />

                  <img
                    className="profile-change-avatar-icon"
                    src={changeAvatar}
                  />
                </div>
                // <img
                //   onClick={() => {
                //     if (userData.userId == userId) {
                //       avatarClick();
                //     }
                //   }}
                //   src={anonymus}
                //   className={`profile-info-avatar ${
                //     userData.userId == userId && "myProfile"
                //   } anonym`}
                // />
              )}

              <div className="profile-info-block">
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
                  {isOwnProfile && (
                    <img
                      className="profile-info-editSign"
                      src={edit}
                      onClick={() => setIsEditing((prev) => !prev)}
                    />
                  )}
                </div>

                <p className="profile-info-email">{userInformation.email}</p>

                {userInformation.status && (
                  <p className="profile-info-status">
                    {userInformation.status}
                  </p>
                )}

                {userInformation.town && (
                  <Link
                    to={`/users?filterType=town&town=${userInformation.town}`}
                    className="profile-info-town"
                  >
                    {userInformation.town}
                  </Link>
                )}

                {isOwnProfile ? null : (
                  <Link
                    to={`/chat?userId=${userData.userId}&user2Id=${userId}`}
                  >
                    <button>Отправить сообщение</button>
                  </Link>
                )}

                {isProfileClosed ? null : (
                  <div
                    className="profile-more-button"
                    onClick={() => setIsMoreShowed((prev) => !prev)}
                  >
                    Подробнее{" "}
                    <p
                      className={`profile-more-rectangle ${
                        isMoreShowed && "active"
                      }`}
                    >
                      ▼
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="profile-editing-block">
              <h1 className="profile-editing-title">Редактировать профиль</h1>

              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Имя"
                  value={profileName}
                  onChange={editFormChangeHandler}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      editLastNameRef.current.focus();
                    }
                  }}
                  className="profileInput"
                />

                <input
                  type="text"
                  name="lastName"
                  ref={editLastNameRef}
                  placeholder="Фамилия"
                  value={profileLastName}
                  onChange={editFormChangeHandler}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      editUsernameRef.current.focus();
                    }
                  }}
                  className="profileInput"
                />

                <input
                  type="text"
                  name="username"
                  ref={editUsernameRef}
                  placeholder="Имя пользователя"
                  value={profileUsername}
                  onChange={editFormChangeHandler}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      editStatusRef.current.focus();
                    }
                  }}
                  className="profileInput"
                />

                <textarea
                  rows={4}
                  type="text"
                  name="status"
                  ref={editStatusRef}
                  placeholder="Статус"
                  value={profileStatus}
                  onChange={editFormChangeHandler}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      editTownRef.current.focus();
                    }
                  }}
                  className="profileInput"
                />

                <input
                  type="text"
                  name="town"
                  ref={editTownRef}
                  placeholder="Город"
                  value={profileTown}
                  onChange={editFormChangeHandler}
                  onKeyDown={saveProfileDataOnKeyPress}
                  className="profileInput"
                />

                <button
                  className="profile-publish-button"
                  onClick={saveProfileData}
                >
                  Сохранить изменения
                </button>
                {editingMessage && (
                  <p className="profile-edit-error">{editingMessage}</p>
                )}
              </>
            </div>
          )}

          {isProfileClosed
            ? null
            : isMoreShowed && (
                <motion.div
                  initial={{ opacity: 0, opacity: 0 }}
                  animate={{ opacity: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {isLikedClosed
                    ? null
                    : userLikedPosts.length !== 0 && (
                        <div className="profile-likedPosts">
                          <h1 className="profile-likedPosts-title">
                            Лайкнутые посты:
                          </h1>
                          <div className="profile-liked-Posts-block">
                            {userLikedPosts.reverse().map((post) => {
                              return (
                                <PostCard
                                  title={post.name}
                                  authorName={post.author.name}
                                  authorLastName={post.author.lastName}
                                  content={post.content}
                                  postId={post._id}
                                  authorEmail={post.author.email}
                                  username={post.author.username}
                                  date={post.date}
                                  userId={userId}
                                  authorId={post.author.id}
                                  postImage={post.imageUrl}
                                  userAvatar={post.author.avatar}
                                  isRoute={true}
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}

                  {isMusicClosed ? null : (
                    <div className="profile-more-block">
                      {userInformation.tracks &&
                        userInformation.tracks.length > 0 && (
                          <div className="profile-tracks">
                            <h1 className="profile-tracks-title">Музыка:</h1>
                            <div className="profile-tracks-block">
                              {userInformation.tracks.map((track) => (
                                <MusicCard
                                  trackId={track.trackId}
                                  trackArtist={track.trackArtist}
                                  trackImageUrl={track.trackImage}
                                  trackPreviewUrl={track.trackPreview}
                                  trackHref={track.trackHref}
                                  trackName={track.trackName}
                                  myTrack={isMyTrack}
                                  fetchUserPosts={fetchUserPosts}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </motion.div>
              )}

          {isOwnProfile && (
            <div className="profile-publish-block">
              <h1 className="profile-publish-title">
                Опубликовать новый пост:
              </h1>
              <input
                type="text"
                name="title"
                ref={titleRef}
                placeholder="Название поста"
                className="profileInput"
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    subtitleRef.current.focus();
                  }
                }}
                onChange={changeFormHandler}
              />
              <textarea
                rows={4}
                type="text"
                name="content"
                ref={subtitleRef}
                placeholder="Описание поста"
                className="profileInput"
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    publishPostHandler();
                  }
                }}
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

          {isProfileClosed ? (
            <p className="profile-closed-profile-message">Закрытый профиль</p>
          ) : (
            <div className="profile-allposts-block">
              {isOwnProfile ? (
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
                          isLikeAvailible={false}
                        />
                      </Link>
                    </>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
