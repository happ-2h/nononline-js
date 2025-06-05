import express from "express";

const usersRouter = express.Router();

usersRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  const uname = username?.trim()?.toLowerCase();
  const pword = password?.trim()?.toLowerCase();

  console.log(/^[a-z]+$/.test(uname));

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
  console.log(uname, pword);
  return res.status(201).json({ message: "User created" });
});

export default usersRouter;