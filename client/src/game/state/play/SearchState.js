import Cursor       from "../../../gfx/ui/Cursor";
import Icon         from "../../../gfx/ui/Icon";
import KeyHandler   from "../../../input/KeyHandler";
import Label        from "../../../gfx/ui/Label";
import Renderer     from "../../../gfx/Renderer";
import settings     from "../../settings";
import SolveState   from "./SolveState";
import State        from "../State";
import StateHandler from "../StateHandler";

import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  TILE_SIZE
} from "../../constants";

export default class SearchState extends State {
  #icon_slash;   // Search forward slash icon
  #cursor;       // Input cursor
  #searchString; // User typed string

  #state;        // 0 = inputting query, 1 = selecting puzzle

  #results;      // Holds puzzles returned

  #inputTimer;
  #inputDelay;

  #label_err;
  #icon_err;

  constructor() {
    super();

    this.#icon_slash = new Icon(8, 21*8, 40, 8);
    this.#cursor     = new Cursor(16, 21*8, -1, -1, -1, -1, true, 0.53);

    this.#searchString = "";

    this.#label_err = new Label("", 24, 8);
    this.#icon_err  = new Icon(8, 8, 24, 8);

    this.#state = 0;

    this.#results = null;

    this.#inputTimer = 0;
    this.#inputDelay = 0.2;
  }

  onEnter() {}
  onExit()  {}

  init() {}

  /**
   * @brief Updates the search state
   *
   * @param {Number} dt - Delta time
   */
  update(dt) {
    this.#cursor.update(dt);

    // Input search query
    if (this.#state === 0) {
      this.#handleInput(dt);
    }
    // User puzzle selection
    else if (this.#state === 1) {
      this.#inputTimer += dt;

      if (this.#inputTimer >= this.#inputDelay) {
        // '0' to '9'
        for (let i = 48; i <= 57; ++i) {
          if (KeyHandler.isDown(i)) {
            this.#inputTimer = 0;
            const index = parseInt(String.fromCharCode(i));

            if (index < this.#results.length) {
              StateHandler.pop();
              StateHandler.push(new SolveState(this.#results[index]));
            }
          }
        }
      }
    }
  }

  /**
   * @brief Renders the search state
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

    this.#icon_slash.draw();

    Renderer.imageText(this.#searchString, 16, 21*8);

    this.#cursor.draw();

    if (this.#label_err.string.length > 0) {
      this.#label_err.draw();
      this.#icon_err.draw();
    }

    // Puzzle results
    if (this.#state === 1) {
      this.#results.forEach((res, y) => {
        Renderer.imageText(y, 8, 8 + y * 16);
        Renderer.imageText(res.title, 24, 8 + y * 16);
        Renderer.imageText(`${res.width}x${res.height}`, 8*15, 8 + y*16);
        Renderer.imageText(
          `id ${res.puzzle_id.slice(0, 13).toUpperCase()}`,
          8*22,
          8 + y * 16
        );
      });
    }
  }

  /**
   * @brief Search query input
   *
   * @param {Number} dt - Delta time
   */
  #handleInput(dt) {
    this.#inputTimer += dt;

    if (this.#inputTimer >= this.#inputDelay) {
      // 'a' - 'z'
      for (let i = 65; i <= 90; ++i) {
        if (KeyHandler.isDown(i)) {
          this.#inputTimer = 0;

          if (this.#searchString.length < 10) {
            this.#searchString += String.fromCharCode(i).toLowerCase();
            this.#cursor.x += 8;
          }
        }
      }

      // Backspace
      if (KeyHandler.isDown(8) && this.#searchString.length > 0) {
        this.#inputTimer = 0;
        this.#searchString = this.#searchString.slice(0, -1);
        this.#cursor.x -= 8;
      }

      // Enter (submit)
      if (KeyHandler.isDown(13)) {
        this.#inputTimer = 0;

        fetch(`http://localhost:5000/api/puzzles?search=${this.#searchString}`)
          .then(res => res.json())
          .then(data => {
            if (
              data.status === 400 ||
              data.status === 404
            ) {
              this.#label_err.string = data.error;
            }
            else if (data.status === 200) {
              this.#state = 1;
              this.#results = [...data.data];
              this.#label_err.string = "";
            }
          })
          .catch(err => {
            if (err.message === "Failed to fetch") {
              this.#label_err.string = "Server may be offline";
            }
          });
      }
    }
  }
};