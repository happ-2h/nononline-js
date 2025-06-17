import settings from "../../game/settings";
import Renderer from "../Renderer";

export default class Board {
  #x;
  #y;
  #width;
  #height;

  constructor(x=0, y=0, width=0, height=0) {
    this.#x = x;
    this.#y = y;
    this.#width = width;
    this.#height = height;
  }

  draw() {
    for (let x = 0; x < this.#width; ++x) {
      for (let y = 0; y < this.#height; ++y) {
        Renderer.image(
          `${settings.theme}_theme`,
          8, 8, 8, 8,
          this.#x + x * 8,
          this.#y + y * 8,
          8, 8
        );
      }
    }
  }

  get x() { return this.#x; }
  get y() { return this.#y; }
  get width() { return this.#width; }
  get height() { return this.#height; }
};