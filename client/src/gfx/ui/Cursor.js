import { TILE_SIZE } from "../../game/constants";
import Renderer from "../Renderer";

export default class Cursor {
  #x;
  #y;

  #sx;
  #sy;

  #delay;
  #timer;

  constructor(x=0, y=0, delay=0.3, sx=208, sy=240) {
    this.#x = x;
    this.#y = y;
    this.#sx = sx;
    this.#sy = sy;

    this.#delay = delay;
    this.#timer = 0;
  }

  update(dt) {
    this.#timer += dt;
  }

  draw() {
    Renderer.image(
      "spritesheet",
      this.#sx, this.#sy, TILE_SIZE, TILE_SIZE,
      this.#x, this.#y, TILE_SIZE, TILE_SIZE
    )
  }

  get x() { return this.#x; }
  get y() { return this.#y; }
  get delay() { return this.#delay; }
  get timer() { return this.#timer; }

  set x(_x) { this.#x = _x; }
  set y(_y) { this.#y = _y; }
  set delay(d) { this.#delay = d; }
  set timer(t) { this.#timer = t; }
};