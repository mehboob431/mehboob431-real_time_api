import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {

  if (req.cookies.access_token != null) {
    jwt.verify(req.cookies.access_token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        res.send({ isAuthenticated: false })
      }
      next();
    });
  }
  else {
    res.status(401).send({ isAuthenticated: false });
  }

};

// verifyUser.js


const verifyUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized - No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Unauthorized - Invalid token' });
    }

    req.user = decoded; // Attach user information to the request object
    next();
  });
};

export default verifyUser;
