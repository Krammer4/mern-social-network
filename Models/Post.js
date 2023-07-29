const { Schema, model, Types } = require("mongoose");

const commentSchema = new Schema({
  author: { type: Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const schema = new Schema({
  title: { type: String, required: true },
  author: { type: Types.ObjectId, ref: "User" },
  //   author: { type: String },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  comments: [commentSchema],
  imageUrl: { type: String },
});

module.exports = model("Post", schema);
