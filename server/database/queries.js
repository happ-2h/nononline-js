import { DatabaseSync } from "node:sqlite";

const database = new DatabaseSync(`${import.meta.dirname}/nononline.db`);

/*
  MAYBE rating and date created
 */
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

const getPuzzle = database.prepare(`
SELECT * FROM puzzles
WHERE puzzle_id = ?
`);

const getPuzzles = database.prepare(`
SELECT * FROM puzzles
ORDER BY title
LIMIT ?, ?
`);

const getRandomPuzzle = database.prepare(`
SELECT * FROM puzzles
ORDER BY random()
LIMIT 1
`);

const getPuzzleByName = database.prepare(`
SELECT * FROM puzzles
WHERE title = ?
`);

export {
  createPuzzle,
  getPuzzle,
  getPuzzles,
  getPuzzleByName,
  getRandomPuzzle
};