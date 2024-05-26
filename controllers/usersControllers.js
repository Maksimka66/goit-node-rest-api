import User from "../schemas/usersSchemas.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";

export const registerUser = async (req, res, next) => {
  const { password, email } = req.body;

  try {
    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({ password: hashPassword, email });

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
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const isMatch = await bcrypt.compare(password, existUser.password);

    if (isMatch === false) {
      return res.status(401).json({ message: "Email or password is wrong" });
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
    console.log(existUser);

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
