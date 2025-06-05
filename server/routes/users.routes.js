// IMPORTANT TODO bcrypt

import express from "express";

const usersRouter = express.Router();

usersRouter.post('/', (req, res) => {
  const { username, password } = req.body;

  // Input validation
  const uname = username.trim();
  const pword = password.trim();

  if (!uname || !pword) {
    res.status(400).json({
      error: "Username and Password cannot be empty"
    });
  }
  else if (uname.length > 10 || pword.length > 10) {
    res.status(400).json({
      error: "Username and Password must be 10 characters or less"
    });
  }
  else {
    res.sendStatus(201);
  }

  console.log(username, password);
});

export default usersRouter;