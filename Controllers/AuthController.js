const User = require("../Models/User");
const { Router } = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Введены некорректные данные при регистрации",
          errors: errors.array(),
        });
      }

      const { name, lastName, email, password, username } = req.body;

      const person = await User.findOne({ email });

      if (person) {
        return res
          .status(400)
          .json({ message: "Пользователь с такой почтой уже существует" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        name,
        lastName,
        email,
        password: hashedPassword,
        username,
      });
      await user.save();
      res.status(201).json({ message: "Пользователь создан!" });
    } catch (error) {
      res.status(500).json({
        message: "Что-то пошло не так. Пожалуйста, попробуйте еще раз...",
      });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Введены некорректные данные при регистрации",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      const person = await User.findOne({ email });

      if (!person) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }

      const isPasswordMatch = await bcrypt.compare(password, person.password);

      if (!isPasswordMatch) {
        return res
          .status(400)
          .json({ message: "Неверный пароль, попробуйте еще раз..." });
      }

      const token = jwt.sign({ userId: person.id }, config.get("jwtsecret"), {
        expiresIn: "2h",
      });

      res.json({ token, userId: person.id });
    } catch (error) {
      res.status(500).json({
        message: "Что-то пошло не так. Пожалуйста, попробуйте еще раз...",
      });
    }
  }
}

module.exports = new AuthController();
