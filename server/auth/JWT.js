import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

const createTokens = (user) => {
  const accessToken = sign(
    {
      id: user.user_id,
      username: user.username
    },
    "changeme"
  );

  return accessToken;
};

export {
  createTokens
};