import express from "express";
import usersRouter from "./routes/users.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet"

const PORT = 5000;
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', usersRouter);

app.listen(PORT, () => console.log(`Listening *:${PORT}`));