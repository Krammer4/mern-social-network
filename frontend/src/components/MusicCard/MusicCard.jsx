import React, { useEffect, useRef, useState } from "react";
import "./MusicCard.css";
import { Link } from "react-router-dom";
import { useHttp } from "../../hooks/httpHook";

import play from "../../img/Music/play.png";
import pause from "../../img/Music/pause.png";
import spotifyLogo from "../../img/Music/spotifyLogo.png";
import { SuccessMessage } from "../../Messages/SuccessMessage/SuccessMessage";

export const MusicCard = ({
  trackId,
  trackName,
  trackArtist,
  trackImageUrl,
  trackPreviewUrl,
  trackHref,
  handleSearchByArtist,
  myTrack,
  fetchUserPosts,
  showSuccessMessage,
  showWarningMessage,
}) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData.userId;
  const { request, message, loading } = useHttp();
  const [isTrackPlaying, setIsTrackPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const audioRef = useRef(null);
  const [isTrackAdded, setIsTrackAdded] = useState(false);

  const togglePlay = () => {
    if (isTrackPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsTrackPlaying(!isTrackPlaying);
  };

  const onVolumeChange = (event) => {
    const changedVolume = event.target.value;
    audioRef.current.volume = changedVolume;
    setVolume(changedVolume);
  };

  const addTrack = async () => {
    const addTrackData = await request(
      `http://localhost:5000/api/add-track`,
      "POST",
      {
        trackName,
        trackArtist,
        trackImage: trackImageUrl,
        trackPreview: trackPreviewUrl,
        trackHref,
        trackId,
        userId,
      }
    );

    console.log("ADD TRACK DATA: ", addTrackData);

    setIsTrackAdded(true);
    if (addTrackData.message == "Такой трек уже есть у вас") {
      return showWarningMessage("Такой трек уже есть у вас");
    } else {
      showSuccessMessage("Трек успешно добавлен");
    }
  };

  const removeTrack = async () => {
    try {
      const removeTrackData = await request(
        `http://localhost:5000/api/delete-user-track`,
        "POST",
        {
          userId,
          trackId,
        }
      );
      if (fetchUserPosts) {
        fetchUserPosts();
      }

      setIsTrackAdded(false);
      showSuccessMessage("Трек успешно удалён");
    } catch (error) {
      console.log("Error while removing track: ", error.message);
    }
  };

  useEffect(() => {
    if (myTrack) {
      return setIsTrackAdded(true);
    }
  }, []);

  return (
    <>
      <div className="music-card" key={trackId}>
        <div className="music-card-row">
          <div className="music-info-row">
            <img className="music-track-image" src={trackImageUrl} />
            <div className="music-info-group">
              <p className="music-card-title">{trackName}</p>
              <Link
                to={`/music/artist/${trackArtist}`}
                className="music-card-artist"
              >
                {trackArtist}
              </Link>
              <a
                className="music-card-spotify-link"
                href={trackHref}
                target="_blank"
              >
                <img
                  className="music-spotify-logo"
                  src={spotifyLogo}
                  alt="spotifyLogo"
                />
              </a>
              {!isTrackAdded ? (
                <p onClick={addTrack} className="music-add-button">
                  Добавить себе
                </p>
              ) : (
                <p onClick={removeTrack} className="music-add-button">
                  Удалить из своего
                </p>
              )}
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={onVolumeChange}
              />
            </div>

            <audio
              className="music-card-audio"
              ref={audioRef}
              src={trackPreviewUrl}
              volume={volume}
              onEnded={() => setIsTrackPlaying(false)}
            />
          </div>
          {/* <button className="music-card-button" onClick={togglePlay}>
            {isTrackPlaying ? "Пауза" : "Воспроизвести"}
          </button> */}
          {isTrackPlaying ? (
            <img
              className="music-card-toggler"
              onClick={togglePlay}
              src={pause}
            />
          ) : (
            <img
              className="music-card-toggler"
              onClick={togglePlay}
              src={play}
            />
          )}
        </div>
      </div>
    </>
  );
};
