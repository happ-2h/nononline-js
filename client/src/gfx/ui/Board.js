import Renderer from "../Renderer";
import settings from "../../game/settings";

export default class Board {
  #x;
  #y;
  #width;
  #height;

  /**
   * @param {Number} x      - x position to place the board
   * @param {Number} y      - y position to place the board
   * @param {Number} width  - Width  of the board
   * @param {Number} height - Height of the board
   */
  constructor(x=0, y=0, width=0, height=0) {
    this.#x = x;
    this.#y = y;
    this.#width  = width;
    this.#height = height;
  }

  /**
   * @brief Draws the board
   */
  draw() {
    for (let x = 0; x < this.#width; ++x) {
      for (let y = 0; y < this.#height; ++y) {
        Renderer.image(
          `${settings.theme}_theme`,
          8, 8, 8, 8,
          this.#x + (x<<3),
          this.#y + (y<<3),
          8, 8
        );
      }
    }
  }

  // Accessors
  get x()      { return this.#x; }
  get y()      { return this.#y; }
  get width()  { return this.#width; }
  get height() { return this.#height; }
};