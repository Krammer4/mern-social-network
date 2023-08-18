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

router.get("/user/:userId", UsersController.getUser);

router.get("/get-user-by-filterType", async (req, res) => {
  const { filterType } = req.query;
  try {
    if (filterType == "town") {
      const { town } = req.query;
      const userByTown = await User.find({ town: town });
      if (!userByTown) {
        return res
          .status(404)
          .json({ message: `Не найдено пользователя по городу ${town}` });
      } else {
        return res.json(userByTown);
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Error while fetching user by town" });
  }
});

router.get("/users/alphabet", UsersController.alphabetSort);

router.get("/users/alphabetReversed", UsersController.alphabetReversed);

router.get("/users/reversed", UsersController.reversed);

router.get("/strictUserSearch", UsersController.strictUserSearch);

router.get("/laxUserSearch", UsersController.laxUserSearch);

router.get("/get-user-tracks/:userId", UsersController.getUserTracks);

router.get("/get-user-liked/:userId", UsersController.getUserLiked);

router.patch("/update-profile/:userId", UsersController.updateProfile);

router.post("/add-track", UsersController.addTrackToUser);

router.post("/update-user-settings", UsersController.updateUserSettings);

router.post("/send-request", async (req, res) => {
  const { requestingUserId, requestedUserId } = req.body;

  try {
    const requestedUser = await User.findById(requestedUserId);
    const requestingUser = await User.findById(requestingUserId);

    if (!requestedUser || !requestingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (requestedUser.requests.includes(requestingUserId)) {
      return res
        .status(400)
        .json({ message: "Вы уже отправили приглошение данному пользователю" });
    }

    requestedUser.requests.push(requestingUserId);
    requestedUser.notes.push(
      `Вам пришел запрос на дружбу от ${requestingUser.name} ${requestingUser.lastName}`
    );
    requestedUser.save();

    return res.json({ message: "Запрос на дружбу был отправлен!" });
  } catch (error) {
    res.status(500).json({ message: "Error while sending request" });
  }
});

router.post("/accept-request", async (req, res) => {
  const { requestedUserId, requestingUserId } = req.body;
  try {
    const requestedUser = await User.findById(requestedUserId);
    const requestingUser = await User.findById(requestingUserId);

    if (!requestedUser || !requestingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // requestedUser.requests = requestedUser.requests.filter(
    //   (request) => request !== requestingUser._id
    // );

    await User.updateOne(
      { _id: requestedUserId },
      { $pull: { requests: requestingUser._id } }
    );
    requestedUser.friends.includes(requestingUser)
      ? null
      : requestedUser.friends.push(requestingUser);
    requestingUser.friends.includes(requestedUser)
      ? null
      : requestingUser.friends.push(requestedUser);

    requestingUser.friends.push(requestedUser);
    requestingUser.notes.push(
      `Пользователь ${requestedUser.name} ${requestedUser.lastName} принял вашу заявку в друзья`
    );

    await requestedUser.save();
    await requestingUser.save();

    return res.json({
      message: `Пользователь ${requestingUser.name} ${requestingUser.lastName} теперь ваш друг`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error while accepting request" });
  }
});

module.exports = router;
