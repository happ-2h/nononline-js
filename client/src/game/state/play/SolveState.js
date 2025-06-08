import Renderer from "../../../gfx/Renderer";
import Cursor from "../../../gfx/ui/Cursor";
import KeyHandler from "../../../input/KeyHandler";
import { clamp } from "../../../math/utils";
import { TILE_SIZE } from "../../constants";
import State from "../State";

export default class SolveState extends State {
  #puzzle;
  #board;
  #board_sol;
  #nums_cols;
  #nums_rows;

  #cursor;

  constructor(puzzle) {
    super();
    this.#puzzle = puzzle;
    this.#board =
      new Array(puzzle.height).fill(0)
      .map(() => new Array(puzzle.width).fill(0));
    this.#board_sol =
      new Array(puzzle.height).fill(0)
      .map(() => new Array(puzzle.width).fill(0));

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

    this.#cursor = new Cursor(50, 50, 0.2, 8, 192);
  }

  onEnter() {}
  onExit() {}

  init() {}

  update(dt) {
    this.#cursor.timer += dt;

    if (KeyHandler.isDown(37)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.x = clamp(this.#cursor.x - 8, 50, 50 + 8 * (this.#board[0].length-1));
      }
    }
    else if (KeyHandler.isDown(39)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.x = clamp(this.#cursor.x + 8, 50, 50 + 8 * (this.#board[0].length-1));
      }
    }
    else if (KeyHandler.isDown(38)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.y = clamp(this.#cursor.y - 8, 50, 50 + 8 * (this.#board.length-1));
      }
    }
    else if (KeyHandler.isDown(40)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.y = clamp(this.#cursor.y + 8, 50, 50 + 8 * (this.#board.length-1));
      }
    }

    // Markers
    // - Set
    if (KeyHandler.isDown(49)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        let cursorx = (this.#cursor.x - 50) / 8;
        let cursory = (this.#cursor.y - 50) / 8;

        this.#board[cursory][cursorx] = this.#board[cursory][cursorx] !== 1 ? 1 : 0;
      }
    }
    // - Cross
    else if (KeyHandler.isDown(50)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        let cursorx = (this.#cursor.x - 50) / 8;
        let cursory = (this.#cursor.y - 50) / 8;

        this.#board[cursory][cursorx] = this.#board[cursory][cursorx] !== 2 ? 2 : 0;
      }
    }
    // - Mark
    else if (KeyHandler.isDown(51)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        let cursorx = (this.#cursor.x - 50) / 8;
        let cursory = (this.#cursor.y - 50) / 8;

        this.#board[cursory][cursorx] = this.#board[cursory][cursorx] !== 3 ? 3 : 0;
      }
    }
  }

  render() {
    // Draw board
    this.#board.forEach((row, y) => {
      row.forEach((num, x) => {
        if (num > 0) {
          Renderer.image(
            "spritesheet",
            num * TILE_SIZE, 200, TILE_SIZE, TILE_SIZE,
            50 + x * TILE_SIZE,
            50 + y * TILE_SIZE,
            TILE_SIZE, TILE_SIZE
          )
        }
      });
    });

    // Draw grid
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

    this.#cursor.draw();
  }
};