const { Router } = require("express");
const upload = require("../middleware/avatarMiddleware");
const User = require("../Models/User");
const UsersController = require("../Controllers/UsersController");
const router = Router();

router.post(
  "/update-avatar",
  upload.single("avatar"),
  UsersController.updateAvatar
);

router.get("/users", UsersController.getAll);

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Такого пользователя не найдено" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error while getting user data" });
  }
});

router.post("/update-user-settings", async (req, res) => {
  const { userId, isClosedProfile, userFavGenre, isClosedMusic } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.settings.isClosedProfile = isClosedProfile;
    user.settings.userFavGenre = userFavGenre;
    user.settings.isClosedMusic = isClosedMusic;

    await user.save();
    res.json({ message: "Настройки успешно сохранены" });
  } catch (error) {
    res.status(500).json({ message: "Error while updating user settings" });
  }
});

router.get("/users/alphabet", UsersController.alphabetSort);

router.get("/users/alphabetReversed", UsersController.alphabetReversed);

router.get("/users/reversed", UsersController.reversed);

router.get("/strictUserSearch", async (req, res) => {
  const searchValue = req.query.searchValue.toString();

  const [firstName, lastName] = searchValue.split(" ");

  const firstNameRegex = new RegExp(`^${firstName}$`, "i");
  const lastNameRegex = new RegExp(`^${lastName}$`, "i");

  try {
    const findResult = await User.find({
      $or: [
        { name: { $regex: firstNameRegex } },
        { lastName: { $regex: lastNameRegex } },
        { username: { $regex: firstNameRegex } },
      ],
    });

    if (!findResult) {
      return res.json({ message: "Пользователь не найден!" });
    }

    res.json(findResult);
  } catch (error) {
    res.json({ message: "Server error!" });
  }
});

router.get("/laxUserSearch", async (req, res) => {
  const searchValue = req.query.searchValue.toString();

  const regex = new RegExp(searchValue, "i");

  try {
    const findResult = await User.find({
      $or: [
        { name: { $regex: regex } },
        { lastName: { $regex: regex } },
        { username: { $regex: regex } },
      ],
    });

    if (!findResult) {
      return res.json({ message: "Пользователь не найден!" });
    }

    res.json(findResult);
  } catch (error) {
    res.json({ message: "Server error!" });
  }
});

router.patch("/update-profile/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { name, lastName, username, status, town, about } = req.body;
  try {
    if (!name || !lastName || !username) {
      return res.status(400).json({
        message:
          "Вы должны обязательно указать Имя, Фамилию и Имя пользователя ",
      });
    }

    const editingUser = await User.findById(userId);

    if (!editingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    editingUser.name = name;
    editingUser.lastName = lastName;
    editingUser.username = username;
    editingUser.status = status;
    editingUser.town = town;
    editingUser.about = about;

    await editingUser.save();

    res.json({ editingUser, message: "Ваши данные успешно обновлены!" });
  } catch (error) {
    res.status(500).json({ message: "Error while updating profile info" });
  }
});

router.post("/add-track", async (req, res) => {
  const {
    trackName,
    trackArtist,
    trackImage,
    trackPreview,
    trackHref,
    trackId,
    userId,
  } = req.body;

  const track = {
    trackName,
    trackArtist,
    trackImage,
    trackPreview,
    trackHref,
    trackId,
    userId,
  };

  try {
    let trackError = [];
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Не удалось найти пользователя..." });
    }

    const userTracks = user.tracks;

    userTracks.forEach((userTrack) => {
      if (userTrack.trackName == track.trackName) {
        trackError.push({ message: "Такой трек уже есть у вас" });
        return res.json({ message: "Такой трек уже есть у вас" });
      }
    });
    if (trackError.length == 0) {
      user.tracks.push(track);

      await user.save();

      res.json({ message: "Трек успешно добавлен!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error while adding track" });
  }
});

router.get("/get-user-tracks/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    const userPosts = user.posts;

    res.json(userPosts);
  } catch (error) {
    res.status(500).json({ message: "Error while getting user tracks" });
  }
});

router.get("/get-user-liked/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate({
      path: "likedPosts",
      populate: { path: "author" },
    });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден... Пожалуйста, повторите попытку",
      });
    }

    res.json(user.likedPosts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching user's liked posts" });
  }
});

module.exports = router;
