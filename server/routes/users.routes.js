// IMPORTANT TODO bcrypt

import express from "express";

const usersRouter = express.Router();

usersRouter.post('/', (req, res) => {
  const { username, password } = req.body;

  console.log(username, password);
  res.sendStatus(201);
});

export default usersRouter;