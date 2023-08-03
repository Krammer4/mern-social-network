const { Router } = require("express");
const router = Router();
const config = require("config");
const axios = require("axios");
const querystring = require("querystring");
const User = require("../Models/User");

const authentificateSpotify = async () => {
  const clientId = config.get("spotify_client_id");
  const clientSecret = config.get("spotify_client_secret");

  try {
    const response = await axios.request({
      method: "POST",
      url: `https://accounts.spotify.com/api/token`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: querystring.stringify({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const accessToken = response.data.access_token;

    return accessToken;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to authenticate with Spotify API");
  }
};

const searchTracks = async (trackName, token) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        trackName
      )}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Ошибка при поиске треков");
    }

    const data = await response.json();
    return data.tracks.items;
  } catch (error) {
    console.error(error);
  }
};

const searchArtist = async (artistName, token) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        artistName
      )}&type=artist`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const artists = response.data.artists.items;
    return artists;
  } catch (error) {
    throw new Error("Error while searching for artist");
  }
};

const getArtistTracks = async (artistId, token) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const tracks = response.data.tracks;
    return tracks;
  } catch (error) {
    throw new Error("Error while fetching artist tracks");
  }
};

const getTopRandomTracksByGenre = async (genre, limit, token) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      params: {
        q: `genre:${genre}`,
        type: "track",
        limit: 50,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const tracks = response.data.tracks.items;

    if (tracks.length === 0) {
      return [];
    }

    const randomTracks = [];
    const selectedIndexes = new Set();

    while (randomTracks.length < Math.min(limit, tracks.length)) {
      const randomIndex = Math.floor(Math.random() * tracks.length);

      if (!selectedIndexes.has(randomIndex)) {
        randomTracks.push(tracks[randomIndex]);
        selectedIndexes.add(randomIndex);
      }
    }

    return randomTracks;
  } catch (error) {
    console.error("Error while fetching top random tracks:", error);
    return [];
  }
};

router.get(`/search-tracks`, async (req, res) => {
  const { trackName } = req.query;
  try {
    const token = await authentificateSpotify();
    const tracks = await searchTracks(trackName, token);

    res.json(tracks);
  } catch (err) {
    res.status(500).json({ message: "Error while fetching track" });
  }
});

router.get("/search-tracks-by-artist/:artistName", async (req, res) => {
  const { artistName } = req.params;

  try {
    const token = await authentificateSpotify();
    const artists = await searchArtist(artistName, token);

    if (artists.length === 0) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const artistId = artists[0].id;
    const tracks = await getArtistTracks(artistId, token);

    res.json(tracks);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching artist and tracks" });
  }
});

router.get("/get-artist/:artistName", async (req, res) => {
  const { artistName } = req.params;
  console.log("ARTIST NAME: ", artistName);
  try {
    const token = await authentificateSpotify();
    const artist = await searchArtist(artistName, token);

    if (!artist) {
      return es
        .status(404)
        .json({ message: "Артиста с таким именем не существует" });
    }

    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching artist" });
  }
});

router.get("/get-tracks-by-genre/:genre", async (req, res) => {
  const { genre } = req.params;
  try {
    const token = await authentificateSpotify();
    const tracksByGenre = await getTopRandomTracksByGenre(genre, 10, token);
    if (!tracksByGenre) {
      return res.status(404).json({
        message:
          "Не удалось подобрать рекомендации( Пожалуйста, перезагрузите страницу",
      });
    }
    res.json(tracksByGenre);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching random tracks by genre" });
  }
});

router.post("/delete-user-track", async (req, res) => {
  const { trackId, userId } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { tracks: { trackId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json({ message: "Трек успешно удален", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting track" });
  }
});

module.exports = router;
