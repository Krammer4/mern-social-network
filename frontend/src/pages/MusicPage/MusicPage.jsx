import axios from "axios";
import React, { useEffect, useState } from "react";
import "./MusicPage.css";
import { MusicCard } from "../../components/MusicCard/MusicCard";
import { SuccessMessage } from "../../Messages/SuccessMessage/SuccessMessage";
import { WarningMessage } from "../../Messages/WarningMessage/WarningMessage";
import { Link } from "react-router-dom";
import MusicCardSkeleton from "../../components/MusicCardSkeleton";
import { useHttp } from "../../hooks/httpHook";
import { backend_url } from "../../consts";

export const MusicPage = () => {
  const { request, error, loading } = useHttp();
  const userStorageData = JSON.parse(localStorage.getItem("userData"));
  const userId = userStorageData.userId;
  const [userData, setUserData] = useState({});
  const [trackName, setTrackName] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [showedTrack, setShowedTrack] = useState("");
  const [showedArtist, setShowedArtist] = useState("");

  const [recommendedByGenre, setRecommendedByGenre] = useState([]);

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

  const fetchUserData = async () => {
    try {
      const response = await request(
        `${backend_url}/api/user/${userId}`,
        "GET"
      );

      setUserData(response);
    } catch (error) {
      console.log("Error while fetching user data: ", error.message);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${backend_url}/api/search-tracks?trackName=${encodeURIComponent(
          trackName
        )}`
      );
      if (!response.ok) {
        throw new Error("Ошибка при выполнении запроса");
      }
      const data = await response.json();
      console.log(data);
      setSearchResults(data);
      setShowedArtist("");
      setShowedTrack(trackName);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchByArtist = async (artistName) => {
    console.log("ARTIST NAME: ", artistName);
    try {
      const response = await fetch(
        `${backend_url}/api/search-tracks-by-artist/${encodeURIComponent(
          artistName
        )}`
      );
      if (!response.ok) {
        throw new Error("Ошибка при выполнении запроса");
      }
      const data = await response.json();
      setSearchResults(data);
      setShowedTrack("");
      setShowedArtist(artistName);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTracksByGenre = async (genre) => {
    try {
      const response = await request(
        `${backend_url}/api/get-tracks-by-genre/${genre}`,
        "GET"
      );
      if (!response) {
        throw new Error("Ошибка при выполнении запроса");
      }

      setRecommendedByGenre(response);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData && userData.settings)
      fetchTracksByGenre(userData.settings?.userFavGenre);
  }, [userData]);

  return (
    <div className="music">
      {isWarningMessageVisible && <WarningMessage message={warningMessage} />}
      {isSuccessMessageVisible && <SuccessMessage message={successMessage} />}
      <div className="music _container">
        <div className="music-content">
          <h1 className="music-mainTitle">Музыка</h1>

          <div className="music-search-row">
            <input
              type="text"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Введите название трека"
              className="music-search-input"
            />
            <button className="music-search-button" onClick={handleSearch}>
              Поиск
            </button>
          </div>

          {showedTrack ? (
            <p className="music-label">
              Треки c названием{" "}
              <span className="music-label-track-name">"{showedTrack}"</span>:
            </p>
          ) : userData.settings?.userFavGenre ? (
            <div className="music-recs">
              <h2 className="music-recs-mainTitle">Рекоммендации для вас:</h2>
              <div className="music-recs-genre-block">
                <h3 className="music-recs-genre-block-title">
                  В жанре{" "}
                  <Link
                    to={`/settings/${userId}`}
                    className="music-recs-genre-name"
                  >
                    {userData.settings?.userFavGenre &&
                      `${userData.settings?.userFavGenre}`}
                  </Link>
                </h3>
                <div className="music-recs-genre-row">
                  {loading ? (
                    <>
                      <MusicCardSkeleton />
                      <MusicCardSkeleton />
                      <MusicCardSkeleton />
                      <MusicCardSkeleton />
                    </>
                  ) : (
                    recommendedByGenre &&
                    recommendedByGenre.map((track) => {
                      return (
                        <MusicCard
                          trackId={track.is}
                          trackName={track.name}
                          trackArtist={track.artists[0]?.name}
                          trackImageUrl={track.album?.images[0]?.url}
                          trackPreviewUrl={track.preview_url}
                          trackHref={track.href}
                          showSuccessMessage={showSuccessMessage}
                          showWarningMessage={showWarningMessage}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="music-fill-settings">
              Для подборки музыкальных рекомендаций, укажите предпочитаемый жанр
              на странице{" "}
              <Link
                to={`/settings/${userId}`}
                className="music-fill-settings-redirect"
              >
                Настройки
              </Link>
              <br />
              <br />
              ИЛИ
              <br />
              <br />
              Воспользуйтесь поисковиком музыки выше
            </p>
          )}

          <div className="music-block">
            {searchResults.map(
              (track) =>
                track.preview_url && (
                  <MusicCard
                    key={track.id}
                    trackId={track.id}
                    trackImageUrl={track.album.images[0].url}
                    trackName={track.name}
                    trackArtist={track.artists[0].name}
                    trackPreviewUrl={track.preview_url}
                    trackHref={track.external_urls.spotify}
                    handleSearchByArtist={handleSearchByArtist}
                    showSuccessMessage={showSuccessMessage}
                    showWarningMessage={showWarningMessage}
                  />
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
