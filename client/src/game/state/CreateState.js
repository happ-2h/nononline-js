import Board        from "../../gfx/ui/Board";
import Cursor       from "../../gfx/ui/Cursor";
import Icon         from "../../gfx/ui/Icon";
import KeyHandler   from "../../input/KeyHandler";
import Label        from "../../gfx/ui/Label";
import Network      from "../../network/Network";
import Renderer     from "../../gfx/Renderer";
import settings     from "../settings";
import State        from "./State";
import StateHandler from "./StateHandler";
import Statusline   from "../../gfx/ui/Statusline";

import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  TILE_SIZE
} from "../constants";

export default class CreateState extends State {
  #state;        // 0 = get info, 1 = draw, 2 = done

  #cursor_input; // Cursor for the form
  #cursor_draw;  // Cursor for drawing on the board

  #label_title;
  #label_width;
  #label_height;
  #label_submit;
  #label_err;
  #icon_err;

  #board;        // Board that holds input data
  #board_ui;     // Board that is drawn on the screen

  #statusline;

  #file;         // Holds data to send to the database

  #keyTimer;
  #keyDelay;

  constructor() {
    super();

    this.#state = 0;

    this.#cursor_input = new Cursor(64, 8, -1, -1, -1, -1, true, 0.53);

    this.#label_title  = new Label("Title", 8, 8);
    this.#label_width  = new Label("Width", 8, 24);
    this.#label_height = new Label("Height", 8, 40);
    this.#label_submit = new Label("Submit enter", 8, 56);
    this.#label_err    = new Label("", 24, 160);
    this.#icon_err     = new Icon(8, 160, 24, 8);

    this.#board_ui     = null;
    this.#cursor_draw  = null;
    this.#statusline   = null;

    this.#board = null;

    this.#file = {
      title:  "",
      width:  "",
      height: "",
      puzzle: []
    };

    this.#keyTimer = 0;
    this.#keyDelay = 0.2;
  }

  onEnter() {}
  onExit()  {}

  /**
   * @brief Initializes the create state
   */
  init() {
    this.#state = 0;
    this.#cursor_input.x = 64;
    this.#cursor_input.y = 8;

    this.#file.title  = "";
    this.#file.width  = "";
    this.#file.height = "";

    this.#keyTimer = 0;
  }

  /**
   * @brief Updates the create state
   *
   * @param {Number} dt - Delta time
   */
  update(dt) {
    // Form: get puzzle information
    if (this.#state === 0) {
      this.#handleInput(dt);
      this.#cursor_input.update(dt);
    }
    // Draw on the board
    else if (this.#state === 1) {
      this.#keyTimer += dt;
      this.#cursor_draw.update(dt);

      this.#statusline.pos = `${this.#cursor_draw.coords.x} ${this.#cursor_draw.coords.y}`;

      if (this.#cursor_draw.selected)
        this.#board[this.#cursor_draw.coords.y][this.#cursor_draw.coords.x] = 1;
      else if (this.#cursor_draw.unselected)
        this.#board[this.#cursor_draw.coords.y][this.#cursor_draw.coords.x] = 0;

      // Clear board
      if (KeyHandler.isDown(67))
        this.#board = this.#board.map(row => row.fill(0));

      // Submit
      if (KeyHandler.isDown(13) && this.#keyTimer >= this.#keyDelay) {
        this.#keyTimer = 0;
        this.#board.forEach(row => {
          let n = 0;
          row.forEach(num => {
            n |= num&1;
            n<<=1;
          });
          n>>=1;

          this.#file.puzzle.push(n);
        });

        // Send to database
        Network.post("/api/puzzles", {
          title:  this.#file.title,
          width:  this.#file.width,
          height: this.#file.height,
          puzzle: this.#file.puzzle
        })
        .then(res => res.json())
        .then(data => {
          // Handle error
          if (data.status === 400) {
            alert(data.error);
            StateHandler.pop();
          }
          // Data accepted
          else if (data.status === 201) {
            this.#state = 2;
            this.#label_submit.string = "Puzzle created";
            this.#keyTimer = 0;
            this.#keyDelay = 2;
          }
        })
        .catch(_ => {
          this.#label_err.string = "Server may be offline";
        });
      }
    }
    // Prepare to leave the create state
    else if (this.#state === 2) {
      this.#keyTimer += dt;

      if (this.#keyTimer >= this.#keyDelay) StateHandler.pop();
    }
  }

  /**
   * @brief Renders the create state
   */
  render() {
    // Background
    Renderer.image(
      `${settings.theme}_theme`,
      0, 56, 8, 8,
      0, 0,
      SCREEN_WIDTH,
      SCREEN_HEIGHT
    );

    // Draw the form
    if (this.#state === 0) {
      Renderer.imageText(this.#file.title,  64,  8);
      Renderer.imageText(this.#file.width,  64, 24);
      Renderer.imageText(this.#file.height, 64, 40);

      this.#label_title.draw();
      this.#label_width.draw();
      this.#label_height.draw();
      this.#label_submit.draw();
      this.#cursor_input.draw();

      if (this.#label_err.string.length > 0) {
        this.#label_err.draw();
        this.#icon_err.draw();
      }
    }
    // Draw the board
    else if (this.#state === 1) {
      this.#board.forEach((row, y) => {
        row.forEach((num, x) => {
          if (num > 0) {
            Renderer.image(
              `${settings.theme}_theme`,
              8, 16, TILE_SIZE, TILE_SIZE,
              this.#board_ui.x + x * TILE_SIZE,
              this.#board_ui.y + y * TILE_SIZE,
              TILE_SIZE, TILE_SIZE
            );

            // Preview
            Renderer.image(
              `${settings.theme}_theme`,
              8, 16, TILE_SIZE, TILE_SIZE,
              8 + (x<<2),
              8 + (y<<2),
              4, 4
            );
          }
        });
      });
      this.#board_ui.draw();
      this.#cursor_draw.draw();
      this.#statusline.draw();
      this.#label_submit.draw();
      this.#label_width.draw();

      if (this.#label_err.string.length > 0) {
        this.#label_err.draw();
        this.#icon_err.draw();
      }
    }
    // Draw the final result
    else if (this.#state === 2) {
      this.#board.forEach((row, y) => {
        row.forEach((num, x) => {
          if (num > 0) {
            Renderer.image(
              `${settings.theme}_theme`,
              8, 16, TILE_SIZE, TILE_SIZE,
              this.#board_ui.x + x * TILE_SIZE,
              this.#board_ui.y + y * TILE_SIZE,
              TILE_SIZE, TILE_SIZE
            );

            // Preview
            Renderer.image(
              `${settings.theme}_theme`,
              8, 16, TILE_SIZE, TILE_SIZE,
              8 + (x<<2),
              8 + (y<<2),
              4, 4
            );
          }
        });
      });

      this.#label_submit.draw();
    }
  }

  /**
   * @brief Handle input
   *
   * @param {Number} dt - Delta time
   */
  #handleInput(dt) {
    this.#keyTimer += dt;
    if (this.#keyTimer < this.#keyDelay) return;

    // Title
    if (this.#cursor_input.y === 8) {
      if (this.#file.title.length < 10) {
        // 'a' - 'z'
        for (let i = 65; i <= 90; ++i) {
          if (KeyHandler.isDown(i)) {
            this.#cursor_input.x += 8;
            this.#keyTimer = 0;
            this.#file.title += String.fromCharCode(i).toLowerCase();
            return;
          }
        }
      }
      // Backspace
      if (KeyHandler.isDown(8)) {
        this.#keyTimer = 0;
        this.#cursor_input.x =
          this.#cursor_input.x - 8 < 64
            ? 64
            : this.#cursor_input.x - 8;
        this.#file.title = this.#file.title.slice(0, -1);
      }
    }
    // Width
    else if (this.#cursor_input.y === 24) {
      if (this.#file.width.length < 2) {
        // '0' - '9'
        for (let i = 48; i <= 57; ++i) {
          if (KeyHandler.isDown(i)) {
            this.#cursor_input.x += 8;
            this.#keyTimer = 0;
            this.#file.width += String.fromCharCode(i);
            return;
          }
        }
      }
      // Backspace
      if (KeyHandler.isDown(8)) {
        this.#keyTimer = 0;
        this.#cursor_input.x =
          this.#cursor_input.x - 8 < 64
            ? 64
            : this.#cursor_input.x - 8;
        this.#file.width = this.#file.width.slice(0, -1);
      }
    }
    // Height
    else if (this.#cursor_input.y === 40) {
      if (this.#file.height.length < 2) {
        // '0' - '9'
        for (let i = 48; i <= 57; ++i) {
          if (KeyHandler.isDown(i)) {
            this.#cursor_input.x += 8;
            this.#keyTimer = 0;
            this.#file.height += String.fromCharCode(i);
            return;
          }
        }
      }
      // Backspace
      if (KeyHandler.isDown(8)) {
        this.#keyTimer = 0;
        this.#cursor_input.x =
          this.#cursor_input.x - 8 < 64
            ? 64
            : this.#cursor_input.x - 8;
        this.#file.height = this.#file.height.slice(0, -1);
      }
    }

    // Submit
    if (KeyHandler.isDown(13)) {
      // Prevent empty submissions
      if (this.#cursor_input.y ===  8 && this.#file.title.length  === 0)  return;
      if (this.#cursor_input.y === 24 && this.#file.width.length  === 0)  return;
      if (this.#cursor_input.y === 40 && this.#file.height.length === 0)  return;

      // Submit
      if (this.#cursor_input.y === 56) {
        if (
          this.#file.title.length > 10 ||
          +this.#file.width  < 2  ||
          +this.#file.width  > 15 ||
          +this.#file.height < 2  ||
          +this.#file.height > 15
        ) {
          this.#label_err.string = "Width and Height must be from 2 to 15";
          this.init();
        }
        else {
          this.#state    = 1;
          this.#keyTimer = 0;
          this.#keyDelay = 1;
          this.#label_err.string = "";
          this.#board_ui    = new Board(96, 24, +this.#file.width, +this.#file.height);
          this.#statusline  = new Statusline(0, 168, SCREEN_WIDTH, 8, this.#file.title);
          this.#cursor_draw = new Cursor(
            96,
            24,
            96,
            96 + ((+this.#file.width-1)<<3),
            24,
            24 + ((+this.#file.height-1)<<3),
            true, 0.53
          );
          this.#label_submit = new Label("Submit   enter", 104, 8);
          this.#label_width  = new Label("Clear    c",     104, 0);
          this.#board =
            new Array(+this.#file.height).fill(0)
            .map(() => new Array(+this.#file.width).fill(0));
        }
      }
      else {
        this.#keyTimer = 0;
        this.#cursor_input.y =
          this.#cursor_input.y + 16 > 56
            ? 56
            : this.#cursor_input.y + 16;
        this.#cursor_input.x = 64;
      }
    }
  }
};