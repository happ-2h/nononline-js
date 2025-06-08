import Renderer from "../../../gfx/Renderer";
import { TILE_SIZE } from "../../constants";
import State from "../State";

export default class SolveState extends State {
  #puzzle;
  #board;
  #board_sol;
  #nums_cols;
  #nums_rows;

  constructor(puzzle) {
    super();
    this.#puzzle = puzzle;
    this.#board =
      new Array(puzzle.height).fill(0)
      .map(() => new Array(puzzle.width).fill(0));
    this.#board_sol = [...this.#board];

    this.#board_sol.forEach((row, y) => {
      let solRow = parseInt(puzzle.puzzle.split(",")[y]).toString(2).padStart(puzzle.width, '0');

      row.forEach((col, x) => {
        this.#board_sol[y][x] = +solRow[x];
      });
    });

    this.#nums_cols = new Array(puzzle.width);
    this.#nums_rows = new Array(puzzle.height);

    // Count column bits
    for (let x = 0; x < puzzle.width; ++x) {
      let counting = false;
      let n = 0;
      this.#nums_cols[x] = [];
      for (let y = 0; y < puzzle.height; ++y) {
        if (!counting && this.#board_sol[y][x] === 1) {
          counting = true;
          ++n;
        }
        else if (counting) {
          if (this.#board_sol[y][x] === 1) {
            ++n;
          }
          else {
            this.#nums_cols[x].push(n);
            counting = false;
            n = 0;
          }
        }
      }

      if (n !== 0) this.#nums_cols[x].push(n);
    }

    // Count row bits
    for (let y = 0; y < puzzle.height; ++y) {
      let counting = false;
      let n = 0;
      this.#nums_rows[y] = [];
      for (let x = 0; x < puzzle.width; ++x) {
        if (!counting && this.#board_sol[y][x] === 1) {
          counting = true;
          ++n;
        }
        else if (counting) {
          if (this.#board_sol[y][x] === 1) {
            ++n;
          }
          else {
            this.#nums_rows[y].push(n);
            counting = false;
            n = 0;
          }
        }
      }

      if (n !== 0) this.#nums_rows[y].push(n);
    }

    // Reverse for canvas placement
    this.#nums_cols.forEach(arr => arr.reverse());
    this.#nums_rows.forEach(arr => arr.reverse());
  }

  onEnter() {}
  onExit() {}

  init() {}

  update(dt) {}

  render() {
    // Draw board
    for (let x = 0; x < this.#puzzle.width; ++x) {
      for (let y = 0; y < this.#puzzle.height; ++y) {
        Renderer.image(
          "spritesheet",
          0, 192, TILE_SIZE, TILE_SIZE,
          50 + x * TILE_SIZE,
          50 + y * TILE_SIZE,
          TILE_SIZE, TILE_SIZE
        );
      }
    }

    // Draw numbers
    // - Cols
    for (let y = 0; y < this.#nums_cols.length; ++y) {
      // 0
      if (this.#nums_cols[y].length === 0) {
        Renderer.image(
          "spritesheet",
          0, 248, TILE_SIZE, TILE_SIZE,
          50 + y * 8, 50-8, TILE_SIZE, TILE_SIZE
        );
      }
      for (let x = 0; x < this.#nums_cols[y].length; ++x) {
        let n = this.#nums_cols[y][x];

        if (n >= 10) {
          // 1
          Renderer.image(
            "spritesheet",
            84, 248, 4, 4,
            50 + (y * 8),
            50  - 8 - x * 8,
            4, 8
          );
          // One's place
          Renderer.image(
            "spritesheet",
            80 + (n%10) * 4, 248, 4, 4,
            50 + (y * 8) + 4,
            50 - 8 - x * 8,
            4, 8
          );
        }
        else {
          Renderer.image(
            "spritesheet",
            n * 8, 248, TILE_SIZE, TILE_SIZE,
            50 + (y * 8),
            50 - 8 - x * 8,
            TILE_SIZE, TILE_SIZE
          );
        }
      }
    }
    // - Rows
    for (let y = 0; y < this.#nums_rows.length; ++y) {
      // 0
      if (this.#nums_rows[y].length === 0) {
        Renderer.image(
          "spritesheet",
          0, 248, TILE_SIZE, TILE_SIZE,
          50 -8, 50 + y * 8, TILE_SIZE, TILE_SIZE
        );
      }
      for (let x = 0; x < this.#nums_rows[y].length; ++x) {
        let n = this.#nums_rows[y][x];

        if (n >= 10) {
        }
        else {
          Renderer.image(
            "spritesheet",
            n * 8, 248, TILE_SIZE, TILE_SIZE,
            50-8 - (x * 8),
            50 + (y * 8),
            TILE_SIZE, TILE_SIZE
          );
        }
      }
    }
  }


};