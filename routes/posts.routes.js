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

router.post("/like-post", async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    const user = await User.findById(userId);
    if (user.likedPosts.includes(postId)) {
      return res.json({ message: "Пост уже лайкнут" });
    }

    user.likedPosts.push(postId);
    post.likes += 1;
    await user.save();
    await post.save();

    res.json({ message: "Лайк успешно добавлен" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при добавлении лайка" });
  }
});

router.post("/unlike-post", async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    const user = await User.findById(userId);
    if (!user.likedPosts.includes(postId)) {
      return res.status(400).json({ message: "Пост еще не лайкнут" });
    }

    user.likedPosts.pop(postId);

    post.likes -= 1;
    await user.save();
    await post.save();

    res.json({ message: "Лайк был убран" });
  } catch (error) {
    return res.status(500).json({ message: "Error while removing like" });
  }
});

module.exports = router;
