import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttp } from "../../hooks/httpHook";

import "./ArtistPage.css";
import { MusicCard } from "../../components/MusicCard/MusicCard";
import { SuccessMessage } from "../../Messages/SuccessMessage/SuccessMessage";
import { WarningMessage } from "../../Messages/WarningMessage/WarningMessage";
import { backend_url } from "../../consts";

export const ArtistPage = () => {
  const { artistName } = useParams();
  const { request, loading, error } = useHttp();

  const [artistInfo, setArtistInfo] = useState({});
  const [artistTracks, setArtistTracks] = useState([]);

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

  const fetchArtist = useCallback(async (artistName) => {
    const artist = await request(`${backend_url}/api/get-artist/${artistName}`);
    setArtistInfo(artist[0]);
  }, []);

  const handleSearchByArtist = async (artistName) => {
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
      setArtistTracks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchArtist(artistName);
    handleSearchByArtist(artistName);
  }, [artistName]);

  return (
    <div className="artistPage">
      {isSuccessMessageVisible && <SuccessMessage message={successMessage} />}
      {isWarningMessageVisible && <WarningMessage message={warningMessage} />}
      <div className="artistPage _container">
        <div className="artistPage-content">
          <div className="artistInfo-block">
            {artistInfo !== {} && (
              <>
                {artistInfo.images && artistInfo.images.length > 0 && (
                  <img
                    src={artistInfo.images[0].url}
                    className="artistPage-image"
                  />
                )}

                <h1 className="artistPage-name">{artistName}</h1>

                {artistInfo.followers && (
                  <p className="artistPage-followers">
                    Отслеживают:{" "}
                    <span className="artistPage-followers-bold">
                      {artistInfo.followers.total}
                    </span>{" "}
                  </p>
                )}

                {artistInfo.genres && artistInfo.genres.length !== 0 && (
                  <div className="artistPage-genres">
                    <span className="artistPage-genre-title">Жанры: </span>
                    {artistInfo.genres.slice(0, 3).map((genre) => (
                      <p className="artistPage-genre-card">{genre}</p>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="artistTracks-block">
            <h1 className="artistTracks-mainTitle">
              Треки артиста {artistName}:
            </h1>

            {artistTracks.map((track) => (
              <MusicCard
                trackId={track.id}
                trackName={track.name}
                trackArtist={track.artists[0].name}
                trackPreviewUrl={track.preview_url}
                trackHref={track.external_urls.spotify}
                trackImageUrl={track.album.images[0].url}
                showWarningMessage={showWarningMessage}
                showSuccessMessage={showSuccessMessage}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
