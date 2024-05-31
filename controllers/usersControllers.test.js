import { loginUser } from "./usersControllers.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../schemas/usersSchemas.js";
import { jest } from "@jest/globals";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("loginUser tests", () => {
  let req, res, next, existUser;

  beforeEach(() => {
    req = { body: { email: "test@example.com", password: "password" } };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    existUser = {
      _id: "user_id",
      email: "test@example.com",
      password: "hashed_password",
      name: "Test User",
      save: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValue(existUser);
    User.findByIdAndUpdate = jest.fn();
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue("token");
  });

  test("response status must be 200", async () => {
    await loginUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("response must return token", async () => {
    await loginUser(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: "token" })
    );
  });

  test("response must return user", async () => {
    await loginUser(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: {
          email: "test@example.com",
          subscription: "starter",
        },
      })
    );
  });
});
