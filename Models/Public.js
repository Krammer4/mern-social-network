const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  title: { type: String },
  subtitle: { type: String },
  avatar: { type: String },
  author: { type: Types.ObjectId, ref: "User" },
  posts: [{ type: Types.ObjectId, ref: "Post" }],
  subscribers: [{ type: Types.ObjectId, ref: "User", default: 0 }],
});

module.exports = model("Public", schema);
