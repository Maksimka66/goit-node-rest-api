import { isValidObjectId } from "mongoose";
import HttpError from "./HttpError.js";

export const isValidId = (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    next(HttpError(404, "Not found"));
  }
  next();
};

export const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

export const validateToken = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: "Помилка від Joi або іншої бібліотеки валідації" });
    }
    next();
  };

  return func;
};
