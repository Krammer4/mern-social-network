const User = require("../Models/User");

class UsersController {
  async updateAvatar(req, res) {
    const avatarPath = req.file ? req.file.path.replace(/\\/g, "/") : null;
    console.log("AVATAR: ", avatarPath);
    try {
      const { userId } = req.body;

      const user = await User.findById(userId);
      console.log("USER WITH AVATAR: ", user);
      user.avatar = avatarPath;
      await user.save();
      res.json({ message: "Ваш аватар успешно изменен!" });
    } catch (error) {
      return res.status(500).json({
        error: "Не удалось обновить аватар... Пожалуйста, попробуйте еще раз",
      });
    }
  }

  async getAll(req, res) {
    try {
      const allUsers = await User.find();

      if (!allUsers) {
        return res
          .status(500)
          .json({ message: "Error while finding all users" });
      }

      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ message: "Error while finding all users" });
    }
  }

  async alphabetSort(req, res) {
    try {
      const users = await User.find();

      if (!users) {
        return res
          .status(500)
          .json({ message: "Error while finding all users" });
      }

      const allUsersSorted = users.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

      res.json(allUsersSorted);
    } catch (error) {
      res.status(500).json({ message: "Error while finding all users" });
    }
  }

  async alphabetReversed(req, res) {
    try {
      const users = await User.find();

      if (!users) {
        return res
          .status(500)
          .json({ message: "Error while finding all users" });
      }

      const allUsersSorted = users.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });

      res.json(allUsersSorted);
    } catch (error) {
      res.status(500).json({ message: "Error while finding all users" });
    }
  }

  async reversed(req, res) {
    try {
      const users = await User.find().sort({ _id: -1 });

      if (!users) {
        return res
          .status(500)
          .json({ message: "Error while finding all users" });
      }

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error while finding all users" });
    }
  }
}

module.exports = new UsersController();
