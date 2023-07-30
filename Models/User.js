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
});

module.exports = model("User", schema);
