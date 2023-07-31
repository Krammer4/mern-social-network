const { Router } = require("express");
const router = Router();
const config = require("config");
const axios = require("axios");
const querystring = require("querystring");

const authentificateSpotify = async () => {
  const clientId = config.get("spotify_client_id");
  const clientSecret = config.get("spotify_client_secret");

  console.log("CLIENT DATA: ", clientId, clientSecret);

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
    console.log("ACCESS TOKEN:", accessToken);
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

module.exports = router;
