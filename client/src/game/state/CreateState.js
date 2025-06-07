import Renderer from "../../gfx/Renderer";
import Button from "../../gfx/ui/Button";
import Cursor from "../../gfx/ui/Cursor";
import Keyboard from "../../gfx/ui/Keyboard";
import KeyboardNum from "../../gfx/ui/KeyboardNum";
import Label from "../../gfx/ui/Label";
import KeyHandler from "../../input/KeyHandler";
import { clamp } from "../../math/utils";
import Network from "../../network/Network";
import { TILE_SIZE } from "../constants";
import State from "./State";
import StateHandler from "./StateHandler";

export default class CreateState extends State {
  #label_title;
  #label_width;
  #label_height;
  #btn_submit;
  #highlight;
  #state;
  #keyboard;
  #keyboardNum;

  #grid;
  #cursor;

  #file;

  constructor() {
    super();

    this.#highlight = 0;
    this.#state = 0;
    this.#label_title  = new Label(10, 10, "title");
    this.#label_width  = new Label(10, 18, "width");
    this.#label_height = new Label(10, 26, "height");
    this.#btn_submit   = new Button(10, 34, 6, 2, "submit");
    this.#keyboard = new Keyboard(100, 100);
    this.#keyboardNum = new KeyboardNum(100, 100);
    this.#file = {
      title: "",
      width: 0,
      height: 0,
      puzzle: []
    };
    this.#grid = null;
    this.#cursor = new Cursor(100, 40, 0.3, 208, 240);
  }

  onEnter() {}
  onExit() {}

  init() {}

  update(dt) {
    if (this.#state === 0) {
      if (this.#highlight === 0) {
        this.#keyboard.update(dt);
        if (this.#keyboard.submitted) {
          // Get title
          if (this.#highlight === 0) {
            this.#file.title = this.#keyboard.string;
            ++this.#highlight;
            this.#keyboard.init();
          }
        }
      }
      else if (this.#highlight === 1 || this.#highlight === 2) {
        this.#keyboardNum.update(dt);

        if (this.#keyboardNum.submitted) {
          // Get width
          if (this.#highlight === 1) {
            this.#file.width = parseInt(this.#keyboardNum.string);
            ++this.#highlight;
            this.#keyboardNum.init();
          }
          // Get height
          else if (this.#highlight === 2) {
            this.#file.height = parseInt(this.#keyboardNum.string);
            ++this.#highlight;
            this.#keyboardNum.init();
          }
        }
      }
      // Submit
      else {
        if (KeyHandler.isDown(13)) {
          this.#state = 1;
          this.#btn_submit.label = "enter";
          this.#btn_submit.callback = () => {
            this.#grid.forEach(row => {
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
              }
            })
            .catch(err => console.error(err));
          };
          this.#grid = new Array(this.#file.height)
            .fill(0).map(() => new Array(this.#file.width).fill(0));
        }
      }
    }
    // Drawing
    else if (this.#state === 1) {
      this.#cursor.timer += dt;

      if (KeyHandler.isDown(37)) {
        if (this.#cursor.timer >= this.#cursor.delay) {
          this.#cursor.timer = 0;
          this.#cursor.x = clamp(this.#cursor.x - 8, 100, 100 + 8 * (this.#grid[0].length-1));
        }
      }
      else if (KeyHandler.isDown(39)) {
        if (this.#cursor.timer >= this.#cursor.delay) {
          this.#cursor.timer = 0;
          this.#cursor.x = clamp(this.#cursor.x + 8, 100, 100 + 8 * (this.#grid[0].length-1));
        }
      }
      else if (KeyHandler.isDown(38)) {
        if (this.#cursor.timer >= this.#cursor.delay) {
          this.#cursor.timer = 0;
          this.#cursor.y = clamp(this.#cursor.y - 8, 40, 40 + 8 * (this.#grid.length-1));
        }
      }
      else if (KeyHandler.isDown(40)) {
        if (this.#cursor.timer >= this.#cursor.delay) {
          this.#cursor.timer = 0;
          this.#cursor.y = clamp(this.#cursor.y + 8, 40, 40 + 8 * (this.#grid.length-1));
        }
      }

      if (KeyHandler.isDown(69)) {
        if (this.#cursor.timer >= this.#cursor.delay) {
          this.#cursor.timer = 0;
          const gx = Math.floor((this.#cursor.x - 100) / TILE_SIZE);
          const gy = Math.floor((this.#cursor.y - 40) / TILE_SIZE);
          this.#grid[gy][gx] = (!this.#grid[gy][gx]&1);
        }
      }
      // Submit
      if (KeyHandler.isDown(13)) {
        if (this.#cursor.timer >= this.#cursor.delay) {
          this.#cursor.timer = 0;
          this.#btn_submit.callback();
        }
      }
    }
  }

  render() {
    if (this.#state === 0) {
      Renderer.image(
        "spritesheet",
        8, 208, TILE_SIZE, TILE_SIZE,
        10, 10 + (this.#highlight * TILE_SIZE),
        40, TILE_SIZE
      );
      this.#label_title.draw();
      this.#label_width.draw();
      this.#label_height.draw();
      this.#btn_submit.draw();

      if (this.#highlight === 0) {
        this.#keyboard.draw();

        [...this.#keyboard.string].forEach((c, i) => {
          const sx = c.charCodeAt(0) - 'a'.charCodeAt(0);

          Renderer.image(
            "spritesheet",
            sx * TILE_SIZE, 240, TILE_SIZE, TILE_SIZE,
            100 + (i*TILE_SIZE), 20, TILE_SIZE, TILE_SIZE
          )
        });
      }
      else {
        this.#keyboardNum.draw();
        [...this.#keyboardNum.string].forEach((c, i) => {
          const sx = c.charCodeAt(0) - '0'.charCodeAt(0);

          Renderer.image(
            "spritesheet",
            sx * TILE_SIZE, 248, TILE_SIZE, TILE_SIZE,
            100 + (i*TILE_SIZE), 20, TILE_SIZE, TILE_SIZE
          )
        });
      }
    }
    else if (this.#state === 1) {
      // Draw grid
      for (let x = 0; x < this.#grid[0].length; ++x) {
        for (let y = 0; y < this.#grid.length; ++y) {
          Renderer.image(
            "spritesheet",
            0, 192, TILE_SIZE, TILE_SIZE,
            100 + x * TILE_SIZE,
            40 + y * TILE_SIZE,
            TILE_SIZE, TILE_SIZE
          );

          if (this.#grid[y][x] === 1) {
            Renderer.image(
              "spritesheet",
              8, 208, TILE_SIZE, TILE_SIZE,
              100 + x * TILE_SIZE,
              40 + y * TILE_SIZE,
              TILE_SIZE, TILE_SIZE
            );
          }
        }
      }

      // Draw cursor
      this.#cursor.draw();

      // Submit button
      this.#btn_submit.draw();
    }
  }
};