const User = require("../Models/User");

class UsersController {
  async getUser(req, res) {
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
  }

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

  async updateProfile(req, res) {
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
  }

  async updateUserSettings(req, res) {
    const {
      userId,
      isClosedProfile,
      userFavGenre,
      isClosedMusic,
      isClosedLikes,
    } = req.body;
    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.settings.isClosedProfile = isClosedProfile;
      user.settings.userFavGenre = userFavGenre;
      user.settings.isClosedMusic = isClosedMusic;
      user.settings.isClosedLikes = isClosedLikes;

      await user.save();
      res.json({ message: "Настройки успешно сохранены" });
    } catch (error) {
      res.status(500).json({ message: "Error while updating user settings" });
    }
  }

  async addTrackToUser(req, res) {
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

  async strictUserSearch(req, res) {
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
  }

  async laxUserSearch(req, res) {
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
  }

  async getUserTracks(req, res) {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      const userPosts = user.posts;

      res.json(userPosts);
    } catch (error) {
      res.status(500).json({ message: "Error while getting user tracks" });
    }
  }

  async getUserLiked(req, res) {
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
  }
}

module.exports = new UsersController();
