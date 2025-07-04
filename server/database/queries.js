import { DatabaseSync } from "node:sqlite";

const database = new DatabaseSync(`${import.meta.dirname}/nononline.db`);

const initDB = `
CREATE TABLE IF NOT EXISTS puzzles (
  puzzle_id TEXT PRIMARY KEY NOT NULL UNIQUE,
  title   TEXT    NOT NULL,
  width   INTEGER NOT NULL,
  height  INTEGER NOT NULL,
  puzzle  TEXT    NOT NULL,
  created INTEGER NOT NULL,
  CHECK (length(title) <= 10)
)
`;

database.exec(initDB);

const createPuzzle = database.prepare(`
INSERT INTO puzzles (puzzle_id, title, width, height, puzzle, created)
VALUES (?, ?, ?, ?, ?, strftime('%s','now'))
RETURNING puzzle_id, title
`);

const getPuzzle = database.prepare(`
SELECT * FROM puzzles
WHERE puzzle_id = ?
`);

const getPuzzles = database.prepare(`
SELECT * FROM puzzles
ORDER BY created
DESC
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
LIMIT 10
`);

export {
  createPuzzle,
  getPuzzle,
  getPuzzles,
  getPuzzleByName,
  getRandomPuzzle
};