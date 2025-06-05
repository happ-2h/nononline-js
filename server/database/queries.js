import { DatabaseSync } from "node:sqlite";

const database = new DatabaseSync('nononline.db');

const initDB = `
CREATE TABLE IF NOX EXISTS users (
  user_id TEXT PRIMARY KEY NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
)
`;

const createUser = database.prepare(`
INSERT INTO users (user_id, username, password)
VALUES (?, ?, ?, ?)
RETURNING user_id, username
`);

const getUsername = database.prepare(`
SELECT user_id, username FROM users WHERE username = ?
`);

const getUserID = database.prepare(`
SELECT user_id, username FROM users WHERE user_id = ?
`);

database.exec(initDB);

export {
  createUser,
  getUsername,
  getUserID
};