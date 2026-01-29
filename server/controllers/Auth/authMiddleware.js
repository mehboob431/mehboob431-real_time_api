import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated");

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json("Token is not valid");
    req.user = user;
    next();
  });
};

export const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json("Access denied");
    }
    next();
  };
};
