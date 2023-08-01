import React, { useRef, useState } from "react";
import "./MusicCard.css";
import { Link } from "react-router-dom";

import play from "../../img/Music/play.png";
import pause from "../../img/Music/pause.png";
import spotifyLogo from "../../img/Music/spotifyLogo.png";

export const MusicCard = ({
  trackId,
  trackName,
  trackArtist,
  trackImageUrl,
  trackPreviewUrl,
  trackHref,
  handleSearchByArtist,
}) => {
  const [isTrackPlaying, setIsTrackPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const audioRef = useRef(null);

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

  return (
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
          <img className="music-card-toggler" onClick={togglePlay} src={play} />
        )}
      </div>
    </div>
  );
};
