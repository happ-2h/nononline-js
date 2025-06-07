import { DatabaseSync } from "node:sqlite";

const database = new DatabaseSync(`${import.meta.dirname}/nononline.db`);

/*const initDB = `
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
)
`;

database.exec(initDB);

const createUser = database.prepare(`
INSERT INTO users (user_id, username, password)
VALUES (?, ?, ?)
RETURNING user_id, username
`);

const getUsername = database.prepare(`
SELECT user_id, username FROM users WHERE username = ?
`);

const getUserID = database.prepare(`
SELECT user_id, username FROM users WHERE user_id = ?
`);

const getUsernamePassword = database.prepare(`
SELECT user_id, username, password FROM users WHERE username = ?
`);*/

const initDB = `
CREATE TABLE IF NOT EXISTS puzzles (
  puzzle_id TEXT PRIMARY KEY NOT NULL UNIQUE,
  title  TEXT    NOT NULL,
  width  INTEGER NOT NULL,
  height INTEGER NOT NULL,
  puzzle TEXT    NOT NULL,
  CHECK (length(title) <= 10)
)
`;

database.exec(initDB);

const createPuzzle = database.prepare(`
INSERT INTO puzzles (puzzle_id, title, width, height, puzzle)
VALUES (?, ?, ?, ?, ?)
RETURNING puzzle_id, title
`);

export {
  /*createUser,
  getUsername,
  getUserID,
  getUsernamePassword*/
  createPuzzle
};