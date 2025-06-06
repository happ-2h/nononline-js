import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

const createTokens = (user) => {
  const accessToken = sign(
    {
      id: user.user_id,
      username: user.username
    },
    process.env.ACCESS_TOKEN_SECRET
  );

  return accessToken;
};

const validateToken = (req, res, next) => {
  // Cookie-based
  /*const accessToken = req.cookies["access-token"];

  // Check if cookie exists
  if (!accessToken) return res.status(401).json({
    error: "User not authenticated"
  });

  // Check if token is valid
  try {
    const isValidToken = verify(accessToken, process.env.ACCESS_TOKEN_SECRET, );
    if (isValidToken) {
      req.authenticated = true;
      return next();
    }
  }
  catch (err) {
    return res.status(400).json({ message: err });
  }*/

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) return res.sendStatus(401);

  verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
};

export {
  createTokens,
  validateToken
};