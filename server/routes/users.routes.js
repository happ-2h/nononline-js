import express from "express";
import bcrypt from "bcrypt";

import { createUser, getUsername, getUsernamePassword } from "../database/queries.js"
import { createTokens, validateToken } from "../auth/JWT.js";

const usersRouter = express.Router();

const saltRounds = 10;

// Create user
usersRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  const uname = username?.trim()?.toLowerCase();
  const pword = password?.trim()?.toLowerCase();

  if (!uname || !pword) {
    return res.status(400).json({
      error: "Username and Password cannot be empty"
    });
  }
  else if (uname.length > 10 || pword.length > 10) {
    return res.status(400).json({
      error: "Username and Password must be 10 characters or less"
    });
  }
  else if (!(/^[a-z]+$/.test(uname)) || !(/^[a-z]+$/.test(pword))) {
    return res.status(400).json({
      error: "Username and Password can only be consecutive letters"
    });
  }

  // Passed validation
  const hashedPassword = await bcrypt.hash(pword, saltRounds);
  const user_id = crypto.randomUUID();

  // Ensure username doesn't exist
  const isUsernameTaken = getUsername.get(uname);

  if (isUsernameTaken)
    return res.status(400).json({ error: "Username already exists"});

  // Add user to database
  const newUser = createUser.get(user_id, uname, hashedPassword);

  return res.status(201).json({
    message: "User created",
    user_id: newUser.user_id,
    username: newUser.username
  });
});

usersRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  const uname = username?.trim();
  const pword = password?.trim();

  if (!uname || !pword) {
    return res.status(400).json({
      error: "Username and Password cannot be empty"
    });
  }

  const loginAttempt = getUsernamePassword.get(username);

  if (!loginAttempt) {
    return res.status(400).json({
      error: "User not found"
    });
  }

  const isValidPassword = await bcrypt.compare(pword, loginAttempt.password);

  if (!isValidPassword) {
    return res.status(400).json({
      error: "Incorrect password"
    });
  }

  // Login succeeded
  const accessToken = createTokens(loginAttempt);
  res.cookie("access-token", accessToken, {
    maxAge: 60*60,
    httpOnly: true
  });

  return res.status(200).json({ message: "Login successful" });
});

usersRouter.get('/profile', validateToken, (req, res) => {
  res.sendStatus(200);
});

export default usersRouter;