import Cursor       from "../../../gfx/ui/Cursor";
import Icon         from "../../../gfx/ui/Icon";
import KeyHandler   from "../../../input/KeyHandler";
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
  #icon_slash;
  #cursor;
  #searchString;
  #errorString;

  #state;

  #results;

  #inputTimer;
  #inputDelay;

  constructor() {
    super();

    this.#icon_slash = new Icon(8, 21*8, 40, 8);
    this.#cursor = new Cursor(16, 21*8, -1, -1, -1, -1, true, 0.53);

    this.#searchString = "";
    this.#errorString  = "";

    this.#state = 0;

    this.#results = null;

    this.#inputTimer = 0;
    this.#inputDelay = 0.2;
  }

  onEnter() {}
  onExit()  {}

  init() {}

  update(dt) {
    this.#cursor.update(dt);

    if (this.#state === 0) {
      this.#handleInput(dt);
    }
    else if (this.#state === 1) {
      this.#inputTimer += dt;

      if (this.#inputTimer >= this.#inputDelay) {
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

    if (this.#errorString.length > 0)
      Renderer.imageText(this.#errorString, 8, 8);

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

  #handleInput(dt) {
    this.#inputTimer += dt;

    if (this.#inputTimer >= this.#inputDelay) {
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
              this.#errorString = data.error;
            }
            else if (data.status === 200) {
              this.#state = 1;
              this.#results = [...data.data];
              this.#errorString = "";
            }
          })
          .catch(err => console.error(err));
      }
    }
  }
};