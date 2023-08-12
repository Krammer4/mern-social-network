const axios = require("axios");
const querystring = require("querystring");
const config = require("config");

const spotifyAuthMiddleware = async (req, res, next) => {
  try {
    const clientId = config.get("spotify_client_id");
    const clientSecret = config.get("spotify_client_secret");

    const response = await axios.request({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",

      data: querystring.stringify({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const accessToken = response.data.access_token;
    req.token = accessToken;

    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to authenticate with Spotify API" });
  }
};

module.exports = spotifyAuthMiddleware;
