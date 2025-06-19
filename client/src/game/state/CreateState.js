import Board        from "../../gfx/ui/Board";
import Cursor       from "../../gfx/ui/Cursor";
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
  #state; // 0 = get info, 1 = draw

  #cursor_input;
  #cursor_draw;

  #label_title;
  #label_width;
  #label_height;
  #label_submit;
  #label_error;

  #board;
  #board_ui;

  #statusline;

  #file;

  #keyTimer;
  #keyDelay;

  constructor() {
    super();

    this.#state = 0;

    this.#cursor_input = new Cursor(8*8, 8, -1, -1, -1, -1, true, 0.53);

    this.#label_title  = new Label("Title", 8, 8);
    this.#label_width  = new Label("Width", 8, 24);
    this.#label_height = new Label("Height", 8, 40);
    this.#label_submit = new Label("Submit enter", 8, 56);
    this.#label_error  = new Label("", 8, 8*21);

    this.#board_ui    = null;
    this.#cursor_draw = null;
    this.#statusline  = null;

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

  init() {
    this.#state = 0;
    this.#cursor_input.x = 64;
    this.#cursor_input.y = 8;

    this.#file.title  = "";
    this.#file.width  = "";
    this.#file.height = "";

    this.#keyTimer = 0;
  }

  update(dt) {
    if (this.#state === 0) {
      this.#handleInput(dt);
      this.#cursor_input.update(dt);
    }
    else if (this.#state === 1) {
      this.#keyTimer += dt;
      this.#cursor_draw.update(dt);

      this.#statusline.pos = `${this.#cursor_draw.coords.x} ${this.#cursor_draw.coords.y}`;

      if (this.#cursor_draw.selected) {
        this.#board[this.#cursor_draw.coords.y][this.#cursor_draw.coords.x] = 1;
      }
      else if (this.#cursor_draw.unselected) {
        this.#board[this.#cursor_draw.coords.y][this.#cursor_draw.coords.x] = 0;
      }

      // Clear board
      if (KeyHandler.isDown(67)) {
        this.#board = this.#board.map(row => row.fill(0));
      }

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
            // TODO inform user of error
            console.log(data.error);
          }
          // Data accepted
          else if (data.status === 201) {
            // TODO inform user of acceptance
            console.log(data.message);
            console.log(data.puzzle_id);
            console.log(data.title);
            StateHandler.pop();
          }
        })
        .catch(err => console.error(err));
      }
    }
  }

  render() {
    // Background
    Renderer.image(
      `${settings.theme}_theme`,
      0, 56, 8, 8,
      0, 0,
      SCREEN_WIDTH,
      SCREEN_HEIGHT
    );

    if (this.#state === 0) {
      Renderer.imageText(this.#file.title, 64, 8);
      Renderer.imageText(this.#file.width, 64, 24);
      Renderer.imageText(this.#file.height, 64, 40);

      this.#label_title.draw();
      this.#label_width.draw();
      this.#label_height.draw();
      this.#label_submit.draw();
      this.#cursor_input.draw();
      this.#label_error.draw();
    }
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
              8 + x * 4,
              8 + y * 4,
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
    }
  }

  #handleInput(dt) {
    this.#keyTimer += dt;
    if (this.#keyTimer < this.#keyDelay) return;

    // Title
    if (this.#cursor_input.y === 8) {
      if (this.#file.title.length < 10) {
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
        this.#cursor_input.x = this.#cursor_input.x - 8 < 64 ? 64 : this.#cursor_input.x - 8;
        this.#file.title = this.#file.title.slice(0, -1);
      }
    }
    // Width
    else if (this.#cursor_input.y === 24) {
      if (this.#file.width.length < 2) {
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
        this.#cursor_input.x = this.#cursor_input.x - 8 < 64 ? 64 : this.#cursor_input.x - 8;
        this.#file.width = this.#file.width.slice(0, -1);
      }
    }
    // Height
    else if (this.#cursor_input.y === 40) {
      if (this.#file.height.length < 2) {
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
        this.#cursor_input.x = this.#cursor_input.x - 8 < 64 ? 64 : this.#cursor_input.x - 8;
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
          +this.#file.width < 2   ||
          +this.#file.width > 16  ||
          +this.#file.height < 2  ||
          +this.#file.height > 16
        ) {
          this.#label_error.string = "Width and Height must be from 2 to 16";
          this.init();
        }
        else {
          this.#state = 1;
          this.#keyTimer = 0;
          this.#keyDelay = 1;
          this.#board_ui = new Board(8*12, 8*3, +this.#file.width, +this.#file.height);
          this.#statusline = new Statusline(0, 8*21, SCREEN_WIDTH, 8, this.#file.title);
          this.#cursor_draw = new Cursor(
            8*12,
            8*3,
            8*12,
            (8*12) + ((+this.#file.width-1) * 8),
            8*3,
            (8*3) + ((+this.#file.height-1) * 8),
            true, 0.53
          );
          this.#label_submit = new Label("Submit   enter", 8*13, 8);
          this.#label_width = new Label("Clear    c", 8*13, 0);
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