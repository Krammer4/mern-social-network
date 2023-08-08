const { promisify } = require("util");
const Post = require("../Models/Post");
const User = require("../Models/User");
const Redis = require("ioredis");
const redisClient = new Redis();

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// redisClient.connect();

redisClient.on("connect", () => {
  console.log("Controller connected to redis");
});

class PostController {
  async createPost(req, res) {
    const { title, content, author } = req.body;
    const imageUrl = req.file ? req.file.path.replace(/\\/g, "/") : null;

    try {
      const user = await User.findById(author);

      const post = new Post({
        title,
        content,
        author: user._id,
        date: new Date(),
        imageUrl,
      });

      await post.save();

      user.posts.push(post._id);
      await user.save();

      res
        .status(201)
        .json({ message: "Пост успешно опубликован!", id: post.id });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Что-то пошло не так, попробуйте снова" });
    }
  }

  async getAll(req, res) {
    try {
      const cachPosts = await redisClient.get("posts");
      if (cachPosts) {
        return res.json(JSON.parse(cachPosts));
      }

      const posts = await Post.find().populate(
        "author",
        "name lastName email username avatar"
      );

      if (posts.length === 0) {
        return res.status(200).json({
          message: "Тут пока нет ни одного поста. Вы можете быть первым!",
        });
      }

      redisClient.set("posts", JSON.stringify(posts));

      return res.json(posts);
    } catch (e) {
      res.status(500).json({
        message: `Не удалось загрузить посты... Пожалуйста, попробуйте еще раз... (${e.message})`,
      });
    }
  }

  async deletePost(req, res) {
    try {
      const postId = req.params.postId;

      const postDeleting = await Post.findById(postId);

      if (!postDeleting) {
        return res.status(404).json({ message: "Post not found" });
      }

      postDeleting.deleteOne();

      res.json({ message: "Post was deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error while deleting post" });
    }
  }

  async getOnePost(req, res) {
    try {
      const postId = req.params.postId;
      const post = await Post.findById(postId)
        .populate("author")
        .populate("comments.author");

      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Error while getting post by its id" });
    }
  }

  async publishComment(req, res) {
    try {
      const postId = req.params.postId;

      const { userId, content } = req.body;

      const commentator = await User.findById(userId);

      const newComment = {
        author: userId,
        content,
        date: new Date(),
      };

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      post.comments.push(newComment);

      await post.save();

      res.json({ message: "Comment was published!" });
    } catch (error) {
      res.status(500).json({ message: "Error while publishing comment" });
    }
  }

  async getUserPosts(req, res) {
    try {
      const userId = req.params.userId;

      const user = await User.findById(userId).populate("posts");

      res.json(user);
    } catch (error) {
      console.log("Error while getting user posts:", error);
    }
  }

  async deleteComment(req, res) {
    try {
      const postId = req.params.postId;
      const commentId = req.params.commentId;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comment = post.comments.find((c) => c._id.toString() === commentId);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      post.comments.pull(commentId);

      await post.save();

      res.json({ message: "Комментарий успешно удален" });
    } catch (error) {
      res.status(500).json({ message: "Error while deleting comment" });
    }
  }

  async likePost(req, res) {
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
  }

  async unLikePost(req, res) {
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
  }
}

module.exports = new PostController();
