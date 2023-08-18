const { Router } = require("express");
const Public = require("../Models/Public");
const User = require("../Models/User");
const router = Router();

router.get("/publics", async (req, res) => {
  try {
    const allPublics = await Public.find();

    if (!allPublics) {
      return res
        .status(404)
        .json({ message: "Не удалось найти ни одного сообщества" });
    }

    res.json(allPublics);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error while fetching all publics: ${error.message}` });
  }
});

module.exports = router;
