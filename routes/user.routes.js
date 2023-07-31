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

module.exports = router;
