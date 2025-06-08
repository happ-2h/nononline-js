import express from "express";

import { createPuzzle, getPuzzle, getPuzzles, getRandomPuzzle } from "../database/queries.js";

const puzzlesRouter = express.Router();

// Create puzzle
puzzlesRouter.post('/', (req, res) => {
  const { title, width, height, puzzle } = req.body;

  // Input validation
  // - Convert input
  const cnvTitle = title?.toString()?.trim()?.toLowerCase();
  const cnvWidth = parseInt(width);
  const cnvHeight = parseInt(height);

  if (
    !cnvTitle ||
    !(/^[a-z]+$/.test(cnvTitle)) ||
    cnvTitle.length <= 0 ||
    cnvTitle.length > 10
  ) {
    return res.status(400).json({
      status: 400,
      error: "Title must only be letters and be between 1 and 10 characters"
    });
  }

  if (
    !cnvWidth ||
    isNaN(cnvWidth) ||
    cnvWidth < 2 ||
    cnvWidth > 16
  ) {
    return res.status(400).json({
      status: 400,
      error: "Width must be between 2 and 16"
    });
  }

  if (
    !cnvHeight ||
    isNaN(cnvHeight) ||
    cnvHeight < 2 ||
    cnvHeight > 16
  ) {
    return res.status(400).json({
      status: 400,
      error: "Height must be between 2 and 16"
    });
  }

  if (
    !Array.isArray(puzzle) ||
    puzzle.length != height
  ) {
    return res.status(400).json({
      status: 400,
      error: "Incorrect puzzle data"
    });
  }

  // Input passed validation
  const puzzle_id = crypto.randomUUID();

  // Add puzzle to the database
  const newPuzzle = createPuzzle.get(
    puzzle_id, cnvTitle, cnvWidth, cnvHeight, puzzle.toString()
  );

  res.status(201).json({
    status: 201,
    message: "Puzzle added",
    puzzle_id: newPuzzle.puzzle_id,
    title: newPuzzle.title
  });
});

// Get multiple puzzles
puzzlesRouter.get('/', (req, res) => {
  const { skip, count, random } = req.query;

  if (count === undefined) {
    return res.status(400).json({
      status: 400,
      error: "count=<number> query is required"
    });
  }

  // Input validation
  // - Convert input
  const cnvSkip  = parseInt(skip || 0);
  const cnvCount = parseInt(count);
  const cnvRandom = parseInt(random || 0);

  if (isNaN(cnvSkip)) {
    return res.status(400).json({
      status: 400,
      error: "\'skip\' query must be an integer"
    });
  }

  if (isNaN(cnvCount)) {
    return res.status(400).json({
      status: 400,
      error: "\'count\' query must be an integer"
    });
  }

  if (isNaN(cnvRandom)) {
    return res.status(400).json({
      status: 400,
      error: "\'random\' query must be 0 or 1"
    });
  }

  // Input passed validation
  let puzzles = null;
  if (cnvRandom === 1) {
    puzzles = getRandomPuzzle.get();
  }
  else {
    puzzles = getPuzzles.all(cnvSkip, cnvCount);
  }

  res.status(200).json({
    status: 200,
    data: puzzles
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

  const puzzle = getPuzzle.get(cnvId);

  res.status(200).json({
    status: 200,
    id:     puzzle.puzzle_id,
    title:  puzzle.title,
    width:  puzzle.width,
    height: puzzle.height,
    puzzle: puzzle.puzzle
  });
});

export default puzzlesRouter;