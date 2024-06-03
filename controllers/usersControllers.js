import * as fs from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";

import User from "../schemas/usersSchemas.js";
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";

const { BASE_URL } = process.env;

export const registerUser = async (req, res, next) => {
  const { password, email } = req.body;

  try {
    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const userAvatar = gravatar.url(email, {}, false);

    const verificationToken = nanoid();

    await User.create({
      password: hashPassword,
      avatarURL: userAvatar,
      email,
      verificationToken,
    });

    const verificationEmail = {
      to: email,
      subject: "You should verificate your email!",
      html: `<a target='_blank' href="
      ${BASE_URL}/users/verify/${verificationToken}">Click to verify email</a>`,
    };

    await sendEmail(verificationEmail);

    res.status(201).json({
      user: {
        email,
        subscription: "starter",
      },
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existUser = await User.findOne({ email });

    if (existUser === null) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (existUser.verify === false) {
      throw HttpError(401, "Email is not verifyed");
    }

    const isMatch = await bcrypt.compare(password, existUser.password);

    if (isMatch === false) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign(
      { id: existUser._id, name: existUser.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "2 days",
      }
    );

    await User.findByIdAndUpdate(existUser._id, { token });

    res.status(200).json({ token, user: { email, subscription: "starter" } });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const existUser = await User.findByIdAndUpdate(req.user.id, {
      token: null,
    });

    if (existUser === null) {
      throw HttpError(401);
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export const getUserByToken = async (req, res, next) => {
  try {
    const id = req.user.id;
    const existUser = await User.findById(id);

    if (existUser === null) {
      throw HttpError(401);
    }

    res.status(200).json({
      email: existUser.email,
      subscription: existUser.subscription,
    });
  } catch (err) {
    next(err);
  }
};

export const userAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "The picture is not exist");
    }

    const oldPath = req.file.path;

    const avatar = await Jimp.read(oldPath);

    await avatar.resize(250, 250).write(oldPath);

    await fs.rename(oldPath, path.resolve("public/avatars", req.file.filename));

    const avatarURL = path.join("avatars", req.file.filename);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL },
      { new: true }
    );

    if (user === null) {
      throw HttpError(401);
    }

    res.status(200).json({ avatarURL });
  } catch (err) {
    next(err);
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    await User.findOneAndUpdate(
      { _id: user._id },
      { verificationToken: null, verify: true }
    );

    res.json({
      message: "Verification successful",
    });
  } catch (err) {
    next(err);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = User.findOne({ email });

    if (!user) {
      throw HttpError(404, "Email not found");
    }

    if (user.verify === true) {
      throw HttpError(400, "Verification has already been passed");
    }

    const verificationEmail = {
      to: email,
      subject: "You should verificate your email!",
      html: `<a target='_blank' href="
      ${BASE_URL}/users/verify/${user.verificationToken}">Click to verify email</a>`,
    };

    await sendEmail(verificationEmail);

    res.json({ message: "Verification email sent" });
  } catch (err) {
    next(err);
  }
};
