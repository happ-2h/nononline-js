import { DatabaseSync } from "node:sqlite";

const database = new DatabaseSync(`${import.meta.dirname}/nononline.db`);

const initDB = `
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

export {
  createUser,
  getUsername,
  getUserID
};