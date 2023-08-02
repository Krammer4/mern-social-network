import axios from "axios";
import React, { useState } from "react";
import "./MusicPage.css";
import { MusicCard } from "../../components/MusicCard/MusicCard";
import { SuccessMessage } from "../../Messages/SuccessMessage/SuccessMessage";
import { WarningMessage } from "../../Messages/WarningMessage/WarningMessage";

export const MusicPage = () => {
  const [trackName, setTrackName] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [showedTrack, setShowedTrack] = useState("");
  const [showedArtist, setShowedArtist] = useState("");

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

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/search-tracks?trackName=${encodeURIComponent(
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
        `http://localhost:5000/api/search-tracks-by-artist/${encodeURIComponent(
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

  return (
    <div className="music">
      {isWarningMessageVisible && <WarningMessage message={warningMessage} />}
      {isSuccessMessageVisible && <SuccessMessage message={successMessage} />}
      <div className="music _container">
        <div className="music-content">
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

          {showedTrack && (
            <p className="music-label">
              Треки c названием{" "}
              <span className="music-label-track-name">"{showedTrack}"</span>:
            </p>
          )}
          {showedArtist && (
            <p className="music-label">Треки артиста {showedArtist}:</p>
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
