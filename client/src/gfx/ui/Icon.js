import { TILE_SIZE } from "../../game/constants";
import settings from "../../game/settings";
import Renderer from "../Renderer";

export default class Icon {
  #x;
  #y;
  #sx;
  #sy;

  constructor(x=0, y=0, sx=0, sy=0) {
    this.#x = x;
    this.#y = y;
    this.#sx = sx;
    this.#sy = sy;
  }

  draw() {
    Renderer.image(
      `${settings.theme}_theme`,
      this.#sx, this.#sy, TILE_SIZE, TILE_SIZE,
      this.#x, this.#y, TILE_SIZE, TILE_SIZE
    );
  }

  get x() { return this.#x; }
  get y() { return this.#y; }

  set x(_x) { this.#x = _x; }
  set y(_y) { this.#y = _y; }
};