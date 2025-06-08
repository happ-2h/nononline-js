import express from "express";
import cors from "cors";
import helmet from "helmet"
import 'dotenv/config';
import puzzlesRouter from "./routes/puzzles.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/puzzles", puzzlesRouter);

app.listen(
  +process.env.SERVER_PORT,
  () => console.log(`Listening *:${+process.env.SERVER_PORT}`)
);