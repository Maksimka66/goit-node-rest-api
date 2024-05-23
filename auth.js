import jwt from "jsonwebtoken";

function authCheck(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  const [bearer, token] = authorizationHeader.split(" ", 2);

  if (!authorizationHeader || bearer !== "Bearer") {
    return res.status(401).json({ message: "Not authorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {});

  next();
}

export default authCheck;
