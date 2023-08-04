const { Router } = require("express");
const router = Router();
const Post = require("../Models/Post");
const User = require("../Models/User");
const PostController = require("../Controllers/PostController");
const upload = require("../middleware/uploadMiddleware");

// Routes

router.post("/posts", upload.single("image"), PostController.createPost);

router.get("/posts", PostController.getAll);

router.get(`/profile/:userId`, PostController.getUserPosts);

router.get("/post/:postId", PostController.getOnePost);

router.post("/post/:postId", PostController.publishComment);

router.delete("/post/:postId", PostController.deletePost);

router.delete("/post/:postId/comment/:commentId", PostController.deleteComment);

router.post("/like-post", PostController.likePost);

router.post("/unlike-post", PostController.unLikePost);

module.exports = router;
