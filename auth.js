import jwt from "jsonwebtoken";
import User from "./schemas/usersSchemas.js";
import HttpError from "./helpers/HttpError.js";

function authCheck(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    throw HttpError(401);
  }

  const [bearer, token] = authorizationHeader.split(" ", 2);

  if (bearer !== "Bearer") {
    throw HttpError(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      throw HttpError(401);
    }
    try {
      const definiteUser = await User.findById(decode.id);

      if (definiteUser === null || definiteUser.token !== token) {
        throw HttpError(401);
      }

      req.user = definiteUser;

      next();
    } catch (err) {
      next(err);
    }
  });
}

export default authCheck;
