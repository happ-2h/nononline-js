import { TILE_SIZE } from "../../game/constants";
import Renderer from "../Renderer";

export default class Label {
  #x;
  #y;
  #string;

  #callback;

  constructor(x=0, y=0, string="") {
    this.#x = x;
    this.#y = y;
    this.#string = string.toLowerCase();
    this.#callback = () => {};
  }

  draw() {
    [...this.#string].forEach((char, i) => {
      const sx = char.charCodeAt(0) - 'a'.charCodeAt(0);

      Renderer.image(
        "spritesheet",
        sx * TILE_SIZE, 240, TILE_SIZE, TILE_SIZE,
        this.#x + i * TILE_SIZE, this.#y,
        TILE_SIZE, TILE_SIZE
      );
    });
  }

  get x() { return this.#x; }
  get y() { return this.#y; }
  get string() { return this.#string; }
  get callback() { return this.#callback; }

  set x(_x) { this.#x = _x; }
  set y(_y) { this.#y = _y; }
  set string(s) { this.#string = s; }
  set callback(cb) { this.#callback = cb; }
};