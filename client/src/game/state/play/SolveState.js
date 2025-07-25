import Board        from "../../../gfx/ui/Board";
import Cursor       from "../../../gfx/ui/Cursor";
import Icon         from "../../../gfx/ui/Icon";
import KeyHandler   from "../../../input/KeyHandler";
import Label        from "../../../gfx/ui/Label";
import Renderer     from "../../../gfx/Renderer";
import settings     from "../../settings";
import Shortcut     from "../../../gfx/ui/Shortcut";
import State        from "../State";
import StateHandler from "../StateHandler";
import Statusline   from "../../../gfx/ui/Statusline";
import WinState     from "./WinState";

import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  TILE_SIZE
} from "../../constants";

export default class SolveState extends State {
  #mode;       // f = fill, c = cross, r = count

  #board;      // Board that holds user data
  #board_sol;  // Board that holds the solution
  #nums_cols;  // Numbers for columns
  #nums_rows;  // Numbers for rows
  #puzzleData; // Puzzle data from the database

  #statusline;
  #board_ui;
  #cursor;
  #shortcut_return;

  constructor(puzzle) {
    super();

    this.#mode = 'f';

    this.#puzzleData = puzzle;

    this.#board =
      new Array(puzzle.height).fill(0)
      .map(() => new Array(puzzle.width).fill(0));
    this.#board_sol =
      new Array(puzzle.height).fill(0)
      .map(() => new Array(puzzle.width).fill(0));

    this.#board_sol.forEach((row, y) => {
      let solRow = parseInt(puzzle.puzzle.split(",")[y])
        .toString(2).padStart(puzzle.width, '0');

      row.forEach((_, x) => this.#board_sol[y][x] = +solRow[x]);
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
          if (this.#board_sol[y][x] === 1) ++n;
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
          if (this.#board_sol[y][x] === 1) ++n;
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

    this.#statusline = new Statusline(
      0, SCREEN_HEIGHT - 12,
      SCREEN_WIDTH, TILE_SIZE,
      puzzle.title
    );

    this.#statusline.mode = "FILL";

    this.#board_ui = new Board(
      (38 - puzzle.width)<<3,
      (20 - puzzle.height)<<3,
      puzzle.width,
      puzzle.height
    );

    this.#cursor = new Cursor(
      this.#board_ui.x,
      this.#board_ui.y,
      this.#board_ui.x,
      this.#board_ui.x + (this.#board_ui.width-1)  * TILE_SIZE,
      this.#board_ui.y,
      this.#board_ui.y + (this.#board_ui.height-1) * TILE_SIZE,
      true,
      0.53
    );

    this.#shortcut_return = new Shortcut(
      8, 152, 10,
      new Icon(0, 0, 40, 0),
      new Label("QUIT", 0, 0),
      'q',
      () => StateHandler.pop()
    );
  }

  onEnter() {}
  onExit()  {}

  init() {}

  /**
   * @brief Updates the solve state
   *
   * @param {Number} dt - Delta time
   */
  update(dt) {
    this.#cursor.update(dt);

    // Change to fill mode
    if (KeyHandler.isDown(70)) {
      this.#mode = 'f';
      this.#statusline.mode = "FILL";
    }
    // Change to cross mode
    else if (KeyHandler.isDown(67)) {
      this.#mode = 'c';
      this.#statusline.mode = "CROSS";
    }
    // Change to count mode
    else if (KeyHandler.isDown(82)) {
      this.#mode = 'r';
      this.#statusline.mode = "COUNT";
    }

    // Return
    if (KeyHandler.isDown(81))
      this.#shortcut_return.callback();

    this.#statusline.pos = `${this.#cursor.coords.y} ${this.#cursor.coords.x}`;

    // Set data based on mode
    if (this.#cursor.selected) {
      if (this.#mode === 'f')
        this.#board[this.#cursor.coords.y][this.#cursor.coords.x] = 1;
      else if (this.#mode === 'c')
        this.#board[this.#cursor.coords.y][this.#cursor.coords.x] = 2;
      else if (this.#mode === 'r')
        this.#board[this.#cursor.coords.y][this.#cursor.coords.x] = 3;

      if (this.#didWin()) {
        StateHandler.pop();
        StateHandler.push(new WinState(this.#board_sol, this.#puzzleData));
      }
    }
    // Reset data based on mode
    else if (this.#cursor.unselected) {
      if (this.#mode === 'f')
        this.#board[this.#cursor.coords.y][this.#cursor.coords.x] = 0;
      else if (this.#mode === 'c')
        this.#board[this.#cursor.coords.y][this.#cursor.coords.x] = 0;
      else if (this.#mode === 'r')
        this.#board[this.#cursor.coords.y][this.#cursor.coords.x] = 0;

      if (this.#didWin()) {
        StateHandler.pop();
        StateHandler.push(new WinState(this.#board_sol, this.#puzzleData));
      }
    }
  }

  /**
   * @brief Renders the solve state
   */
  render() {
    // Background
    Renderer.image(
      `${settings.theme}_theme`,
      0, 56, TILE_SIZE, TILE_SIZE,
      0, 0,
      SCREEN_WIDTH,
      SCREEN_HEIGHT
    );

    // Draw board
    this.#board.forEach((row, y) => {
      row.forEach((num, x) => {
        if (num > 0) {
          Renderer.image(
            `${settings.theme}_theme`,
            num * TILE_SIZE, 16, TILE_SIZE, TILE_SIZE,
            this.#board_ui.x + x * TILE_SIZE,
            this.#board_ui.y + y * TILE_SIZE,
            TILE_SIZE, TILE_SIZE
          )
        }
      });
    });

    // Draw numbers
    // - Cols
    for (let y = 0; y < this.#nums_cols.length; ++y) {
      // 0
      if (this.#nums_cols[y].length === 0)
        Renderer.imageText(
          "0",
          this.#board_ui.x + (y<<3) + 2,
          this.#board_ui.y - 8,
          true
        );

      for (let x = 0; x < this.#nums_cols[y].length; ++x) {
        let n = this.#nums_cols[y][x];

        if (n >= 10) {
          // 1
          Renderer.image(
            `${settings.theme}_font`,
            84, 16, 4, 4,
            this.#board_ui.x + (y<<3),
            this.#board_ui.y - 8 - x * 5,
            4, 4
          );
          // One's place
          Renderer.image(
            `${settings.theme}_font`,
            80 + ((n%10)<<2), 16, 4, 4,
            this.#board_ui.x + (y<<3) + 4,
            this.#board_ui.y - 8 - x * 5,
            4, 4
          );
        }
        else
          Renderer.imageText(
            n,
            this.#board_ui.x + (y<<3) + 2,
            this.#board_ui.y - 8 - x * 5,
            true
          );
      }
    }
    // - Rows
    for (let y = 0; y < this.#nums_rows.length; ++y) {
      // 0
      if (this.#nums_rows[y].length === 0)
        Renderer.imageText(
          '0',
          this.#board_ui.x - 8,
          this.#board_ui.y + 2 + (y<<3),
          true
        );

      for (let x = 0; x < this.#nums_rows[y].length; ++x) {
        let n = this.#nums_rows[y][x];

        if (n >= 10) {
          // 1
          Renderer.image(
            `${settings.theme}_font`,
            84, 16, 4, 4,
            this.#board_ui.x - 8 - (x<<3),
            this.#board_ui.y + (y<<3) + 2,
            4, 4
          );
          // One's place
          Renderer.image(
            `${settings.theme}_font`,
            80 + ((n%10)<<2), 16, 4, 4,
            this.#board_ui.x - 4 - (x<<3),
            this.#board_ui.y + (y<<3) + 2,
            4, 4
          );
        }
        else
          Renderer.imageText(
            n,
            this.#board_ui.x - 8 - x * 5,
            this.#board_ui.y + (y<<3) + 2,
            true
          );
      }
    }

    this.#statusline.draw();
    this.#board_ui.draw();
    this.#cursor.draw();
    this.#shortcut_return.draw();
  }

  /**
   * @brief Check if the current move resulted in a win
   *
   * @returns true if board matches board_sol; false otherwise
   */
  #didWin() {
    for (let y = 0; y < this.#board.length; ++y) {
      for (let x = 0; x < this.#board[0].length; ++x) {
        if (
          this.#board_sol[y][x] === 1 && this.#board[y][x] !== 1 ||
          this.#board_sol[y][x] === 0 && this.#board[y][x] === 1
        ) return false;
      }
    }

    return true;
  }
};