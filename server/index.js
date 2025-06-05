import express from "express";
import usersRouter from "./routes/users.routes.js";
import cors from "cors";

const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);

app.listen(PORT, () => console.log(`Listening *:${PORT}`));