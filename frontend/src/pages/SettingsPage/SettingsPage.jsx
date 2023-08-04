import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SettingsPage.css";
import { useHttp } from "../../hooks/httpHook";
import { SuccessMessage } from "../../Messages/SuccessMessage/SuccessMessage";

export const SettingsPage = () => {
  const { userId } = useParams();
  const userDataFormStorage = JSON.parse(localStorage.getItem("userData"));
  const { request, loading, error } = useHttp();

  const [isClosedProfile, setIsClosedProfile] = useState(false);
  const [isClosedMusic, setIsClosedMusic] = useState(false);
  const [isClosedLikes, setIsClosedLikes] = useState(false);
  const [userFavGenre, setUserFavGenre] = useState("");
  const [userData, setUserData] = useState({});
  const genres = [
    { title: "Rap", id: 1 },
    { title: "Rock", id: 2 },
    { title: "Hip-Hop", id: 3 },
    { title: "Pop", id: 4 },
    { title: "Electronic", id: 5 },
    { title: "R&B", id: 6 },
    { title: "Indie", id: 7 },
    { title: "Country", id: 8 },
    { title: "Dance", id: 9 },
    { title: "Latin", id: 10 },

    { title: "Jazz", id: 11 },
    { title: "Blues", id: 12 },
    { title: "Classical", id: 13 },
    { title: "Metal", id: 14 },
    { title: "Alternative", id: 15 },
    { title: "Punk", id: 16 },
    { title: "Reggae", id: 17 },

    { title: "Folk", id: 18 },
    { title: "Techno", id: 19 },
    { title: "House", id: 20 },

    { title: "Ambient", id: 21 },
    { title: "Grunge", id: 22 },
    { title: "Disco", id: 23 },
    { title: "Synth-pop", id: 24 },
  ];
  const [activeGenreButton, setActiveGenreButton] = useState(0);

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

  const fetchUserData = async (userId) => {
    const userFetchedData = await request(
      `http://localhost:5000/api/user/${userId}`,
      "GET"
    );

    setUserData(userFetchedData);
  };

  useEffect(() => {
    fetchUserData(userId);
  }, []);

  useEffect(() => {
    if (userData.settings && userData.settings.userFavGenre) {
      setUserFavGenre(userData.settings.userFavGenre);
    }
    if (userData.settings && userData.settings.isClosedProfile) {
      setIsClosedProfile(userData.settings.isClosedProfile);
    }
    if (userData.settings && userData.settings.isClosedMusic) {
      setIsClosedMusic(userData.settings.isClosedMusic);
    }
    if (userData.settings && userData.settings.isClosedLikes) {
      setIsClosedLikes(userData.settings.isClosedLikes);
    }
  }, [
    userData.settings?.userFavGenre,
    userData.settings?.isClosedProfile,
    userData.settings?.isClosedMusic,
    userData.settings?.isClosedLikes,
  ]);

  const saveUserSettings = async () => {
    try {
      const saveSettingsResult = await request(
        "http://localhost:5000/api/update-user-settings",
        "POST",
        {
          userId: userId,
          isClosedProfile: isClosedProfile,
          userFavGenre: userFavGenre,
          isClosedMusic: isClosedMusic,
          isClosedLikes,
        }
      );

      showSuccessMessage("Настройки успешно сохранены");
      fetchUserData(userId);
    } catch (error) {
      console.log("Error while saving settings: ", error.message);
    }
  };

  return userId == userDataFormStorage.userId ? (
    <div className="settings">
      {isSuccessMessageVisible && <SuccessMessage message={successMessage} />}
      <div className="settings _container">
        <div className="settings-content">
          <div className="settings-block">
            <h1 className="settings-mainTitle">Настройки</h1>

            <h2 className="settings-secondary-title">
              Настройки конфиденциальности:
            </h2>

            <div className="settings-setting-row">
              <p className="settings-setting-type">Закрытый профиль:</p>

              {userData.settings && (
                <label class="switch">
                  <input
                    type="checkbox"
                    checked={isClosedProfile}
                    onChange={() => setIsClosedProfile((prev) => !prev)}
                  />
                  <span class="slider round"></span>
                </label>
              )}
            </div>

            <div className="settings-setting-row">
              <p className="settings-setting-type">
                Скрыть понравившиеся посты:
              </p>

              {userData.settings && (
                <label class="switch">
                  <input
                    type="checkbox"
                    checked={isClosedLikes}
                    onChange={() => setIsClosedLikes((prev) => !prev)}
                  />
                  <span class="slider round"></span>
                </label>
              )}
            </div>

            <h2 className="settings-secondary-title">Настройки музыки:</h2>

            <div className="settings-setting-row">
              <p className="settings-setting-type">Предпочитаемый жанр:</p>
              <p className="settings-your-genre">
                {userData.settings && userData.settings.userFavGenre
                  ? userData.settings.userFavGenre
                  : "Выберите жанр ниже"}
              </p>
            </div>
            <div className="settings-genres-buttons-row">
              {genres &&
                genres.map((genre) => {
                  return (
                    <button
                      onClick={() => {
                        setUserFavGenre(genre.title);
                        setActiveGenreButton(genre.id);

                        if (activeGenreButton === genre.id) {
                          setActiveGenreButton(0);
                          setUserFavGenre("");
                        }
                      }}
                      key={genre.id}
                      className={`settings-genre-button ${
                        genre.id == activeGenreButton && "active"
                      }`}
                    >
                      {genre.title}
                    </button>
                  );
                })}
              <button
                className={`settings-genre-button`}
                onClick={() => {
                  setUserFavGenre("");
                  setActiveGenreButton(0);
                }}
              >
                Очистить
              </button>
            </div>

            <div className="settings-setting-row">
              <p className="settings-setting-type">
                Закрыть от всех мою музыку:
              </p>

              {userData.settings && (
                <label class="switch">
                  <input
                    type="checkbox"
                    checked={isClosedMusic}
                    onChange={() => setIsClosedMusic((prev) => !prev)}
                  />
                  <span class="slider round"></span>
                </label>
              )}
            </div>

            <button onClick={saveUserSettings} className="settings-save-button">
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <h1>Кажется, это не ваш аккаунт!</h1>
  );
};
