import Label    from "./Label";
import Renderer from "../Renderer";
import settings from "../../game/settings";

import { TILE_SIZE } from "../../game/constants";

export default class Statusline {
  #x;
  #y;
  #width;
  #height;

  #label_name; // Puzzle name
  #label_mode; // Current user mode
  #label_pos;  // Cursor position

  /**
   * @param {Number} x          - x position to place the statusline
   * @param {Number} y          - y position to place the statusline
   * @param {Number} width      - Width  of the statusline
   * @param {Number} height     - Height of the statusline
   * @param {String} puzzleName - Name of the puzzle
   */
  constructor(x=0, y=0, width=0, height=0, puzzleName="") {
    this.#x = x;
    this.#y = y;
    this.#width  = width;
    this.#height = height;

    this.#label_name = new Label(puzzleName, x, y);
    this.#label_mode = new Label("INSERT", x + 104, y);
    this.#label_pos  = new Label("00 00", x + 272, y);
  }

  /**
   * @brief Draws the statusline
   */
  draw() {
    // Background
    Renderer.image(
      `${settings.theme}_theme`,
      8, 56, TILE_SIZE, TILE_SIZE,
      this.#x,
      this.#y,
      this.#width,
      this.#height
    );

    this.#label_name.draw();
    this.#label_mode.draw();
    this.#label_pos.draw();
  }

  // Mutators
  set pos(str)  { this.#label_pos.string  = str; }
  set mode(str) { this.#label_mode.string = str; }
};