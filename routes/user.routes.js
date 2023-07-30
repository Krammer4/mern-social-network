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

router.get("/users/alphabet", UsersController.alphabetSort);

router.get("/users/alphabetReversed", UsersController.alphabetReversed);

router.get("/users/reversed", UsersController.reversed);

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

module.exports = router;
