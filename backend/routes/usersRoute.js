import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { applyPassportStrategybasic } from "../middleware/basicStrategy.js";
import { applyPassportStrategyjwt } from "../middleware/jwtStrategy.js";

dotenv.config();
let jwtSecretKey = process.env.JWTKEY;

const usersRoute = express.Router();

applyPassportStrategybasic(passport);
applyPassportStrategyjwt(passport);

usersRoute.post("/register", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const roles = req.body.roles;

  if (!username && !email && !roles) {
    res.status(404).send({ message: "Correct infromation not sent" });
    return;
  }

  const salt = bcrypt.genSaltSync(6);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  const password = hashedPassword;

  const newUser = new User({
    username,
    email,
    password,
    roles,
  });
  res.status(201);

  newUser
    .save()
    .then(res.status(201).json({ message: "User created, log in" }));
});

usersRoute.post(
  "/Login",
  passport.authenticate("basic", { session: false }),
  (req, res) => {
    const body = {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      roles: req.user.roles,
    };

    const payload = {
      user: body,
    };

    const options = {
      expiresIn: "1d",
    };

    const token = jwt.sign(payload, jwtSecretKey, options);

    return res.json({ token, body });
  },
);

usersRoute.get(
  "/haveToken",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const body = {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      roles: req.user.roles,
    };
    return res.json({ body });
  },
);

usersRoute.delete(
  "/deleteUser/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;
    if (!id) {
      res.status(404).send({ message: "No id found" });
      return;
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(400).json("User not found");
    }
    res.status(200).json("User deleted successfully");
  },
);

export default usersRoute;