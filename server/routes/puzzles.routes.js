import express from "express";

import {
  createPuzzle,
  getPuzzle,
  getPuzzleByName,
  getPuzzles,
  getRandomPuzzle
} from "../database/queries.js";

const puzzlesRouter = express.Router();

// Create puzzle
puzzlesRouter.post('/', (req, res) => {
  const { title, width, height, puzzle } = req.body;

  // Input validation
  // - Convert input
  const cnvTitle  = title?.toString()?.trim()?.toLowerCase();
  const cnvWidth  = parseInt(width);
  const cnvHeight = parseInt(height);

  if (
    !cnvTitle ||
    !(/^[a-z]+$/.test(cnvTitle)) ||
    cnvTitle.length <= 0 ||
    cnvTitle.length > 10
  ) {
    return res.status(400).json({
      status: 400,
      error:  "Title must only be letters and be between 1 and 10 characters"
    });
  }

  if (
    !cnvWidth       ||
    isNaN(cnvWidth) ||
    cnvWidth < 2    ||
    cnvWidth > 15
  ) {
    return res.status(400).json({
      status: 400,
      error:  "Width must be between 2 and 15"
    });
  }

  if (
    !cnvHeight       ||
    isNaN(cnvHeight) ||
    cnvHeight < 2    ||
    cnvHeight > 15
  ) {
    return res.status(400).json({
      status: 400,
      error:  "Height must be between 2 and 15"
    });
  }

  if (
    !Array.isArray(puzzle) ||
    puzzle.length != height
  ) {
    return res.status(400).json({
      status: 400,
      error:  "Incorrect puzzle data"
    });
  }

  // Input passed validation
  const puzzle_id = crypto.randomUUID();

  // Add puzzle to the database
  const newPuzzle = createPuzzle.get(
    puzzle_id,
    cnvTitle,
    cnvWidth,
    cnvHeight,
    puzzle.toString()
  );

  res.status(201).json({
    status:    201,
    message:   "Puzzle added",
    puzzle_id: newPuzzle.puzzle_id,
    title:     newPuzzle.title
  });
});

// Get multiple puzzles
puzzlesRouter.get('/', (req, res) => {
  const { random, search } = req.query;
  const range = req.query.range ?? "0,10";

  // Input validation
  // - Convert input
  const cnvRandom = parseInt(random || 0);
  const cnvSearch = search?.toString().toLowerCase().trim();
  const cnvRange  = range.split(',').map(Number);

  if (isNaN(cnvRandom) || cnvRandom > 1 || cnvRandom < 0) {
    return res.status(400).json({
      status: 400,
      error:  "\'random\' query must be 0 or 1"
    });
  }

  if (cnvSearch !== undefined) {
    if (cnvSearch.length === 0) {
      return res.status(400).json({
        status: 400,
        error: "Search query cannot be empty"
      });
    }
    else if (cnvSearch.length > 10) {
      return res.status(400).json({
        status: 400,
        error: "Search query must be 1 to 10 characters"
      });
    }
  }

  if (isNaN(cnvRange[0]) || isNaN(cnvRange[1])) {
    return res.status(400).json({
      status: 400,
      error: "\'range\' must be in the format <number>,<number>"
    });
  }

  // Get data
  let data = null;

  if (cnvRandom === 1) data = getRandomPuzzle.get();
  else if (cnvSearch !== undefined) data = getPuzzleByName.all(cnvSearch);
  else data = getPuzzles.all(cnvRange[0], cnvRange[1]);

  // No data found
  if (!data || data.length === 0) {
    return res.status(404).json({
      status: 404,
      error: "Not found"
    });
  }

  // Input passed validation
  res.status(200).json({
    status: 200,
    data
  });
});

puzzlesRouter.get('/puzzle/:id', (req, res) => {
  const { id } = req.params;

  // Input validation
  const cnvId = id?.toString()?.trim();

  if (
    !cnvId ||
    !(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(cnvId))
  ) {
    return res.status(400).json({
      status: 400,
      error: "Incorrect parameter format"
    });
  }

  // Input passed validation
  const puzzle = getPuzzle.get(cnvId);

  res.status(200).json({
    status:  200,
    id:      puzzle.puzzle_id,
    title:   puzzle.title,
    width:   puzzle.width,
    height:  puzzle.height,
    puzzle:  puzzle.puzzle,
    created: puzzle.created
  });
});

export default puzzlesRouter;