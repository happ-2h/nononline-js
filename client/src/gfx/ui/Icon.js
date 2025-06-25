import Renderer from "../Renderer";
import settings from "../../game/settings";

import { TILE_SIZE } from "../../game/constants";

export default class Icon {
  #x;
  #y;
  #sx;
  #sy;

  /**
   * @param {Number} x  - x position to palce the icon
   * @param {Number} y  - y position to place the icon
   * @param {Number} sx - Image source x of the icon
   * @param {Number} sy - Image source y of the icon
   */
  constructor(x=0, y=0, sx=0, sy=0) {
    this.#x  = x;
    this.#y  = y;
    this.#sx = sx;
    this.#sy = sy;
  }

  /**
   * @brief Draws the icon
   */
  draw() {
    Renderer.image(
      `${settings.theme}_theme`,
      this.#sx, this.#sy, TILE_SIZE, TILE_SIZE,
      this.#x, this.#y, TILE_SIZE, TILE_SIZE
    );
  }

  // Accessors
  get x() { return this.#x; }
  get y() { return this.#y; }

  // Mutators
  set x(_x) { this.#x = _x; }
  set y(_y) { this.#y = _y; }
};