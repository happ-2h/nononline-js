import Renderer from "../../gfx/Renderer";
import Button from "../../gfx/ui/Button";
import Cursor from "../../gfx/ui/Cursor";
import Keyboard from "../../gfx/ui/Keyboard";
import Label from "../../gfx/ui/Label";
import KeyHandler from "../../input/KeyHandler";
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
  #submit_timer;
  #submit_delay;

  #grid;
  #cursor;

  #file;

  constructor() {
    super();

    this.#highlight = 0;
    this.#state = 0;
    this.#label_title  = new Label("title", 10, 10);
    this.#label_width  = new Label("width", 10, 18);
    this.#label_height = new Label("height", 10, 26);
    this.#btn_submit   = new Button(10, 34, 6, 2, "submit");
    this.#keyboard = new Keyboard(100, 100);
    this.#keyboardNum = new Keyboard(100, 100, "number");
    this.#file = {
      title: "",
      width: 0,
      height: 0,
      puzzle: []
    };
    this.#grid = null;
    this.#cursor = null;

    // Final puzzle submission to database
    this.#submit_timer = 0;
    this.#submit_delay = 0.3;
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
          this.#btn_submit.label.string = "enter";
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
                StateHandler.pop();
              }
            })
            .catch(err => console.error(err));
          };
          this.#grid = new Array(this.#file.height)
            .fill(0).map(() => new Array(this.#file.width).fill(0));
          console.log(100 + 8 * (this.#grid[0].length - 1));
          this.#cursor = new Cursor(
            100 - 8, 40,
            100 - 8, 100 + 8 * (this.#grid[0].length-2),
            40, 40 + 8 * (this.#grid.length-1),
            8, 0.3, false
          );
        }
      }
    }
    // Drawing
    else if (this.#state === 1) {
     this.#submit_timer += dt;

      this.#cursor.update(dt);

      // Set tile
      if (this.#cursor.selected) {
        const gx = Math.floor((this.#cursor.x - 100 + 8) / TILE_SIZE);
        const gy = Math.floor((this.#cursor.y - 40) / TILE_SIZE);
        this.#grid[gy][gx] = (!this.#grid[gy][gx]&1);
      }

      // Submit the puzzle
      if (KeyHandler.isDown(81)) {
        if (this.#submit_timer >= this.#submit_delay) {
          this.#submit_timer = 0;
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
        Renderer.imageText(this.#keyboard.string, 100, 20);
      }
      else {
        this.#keyboardNum.draw();
        Renderer.imageText(this.#keyboardNum.string, 100, 20);
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