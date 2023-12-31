const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  posts: [{ type: Types.ObjectId, ref: "Post" }],
  avatar: { type: String },
  status: { type: String },
  town: { type: String },
  requests: [{ type: Types.ObjectId, ref: "User" }],
  friends: [{ type: Types.ObjectId, ref: "User" }],
  notes: [{ type: String }],
  tracks: [
    {
      trackName: { type: String, required: true },
      trackId: { type: String },
      trackArtist: { type: String, required: true },
      trackImage: { type: String, required: true },
      trackPreview: { type: String, required: true },
      trackHref: { type: String, required: true },
    },
  ],
  likedPosts: [{ type: Types.ObjectId, ref: "Post" }],
  settings: {
    isClosedProfile: { type: Boolean, default: false },
    userFavGenre: { type: String, default: "" },
    isClosedMusic: { type: Boolean, default: false },
    isClosedLikes: { type: Boolean, default: false },
    isClosedFriends: { type: Boolean, default: false },
  },
});

module.exports = model("User", schema);
