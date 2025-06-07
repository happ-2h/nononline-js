import { TILE_SIZE } from "../../game/constants";
import Renderer from "../Renderer";

export default class Label {
  #id;
  #x;
  #y;
  #string;

  #callback;

  constructor(x=0, y=0, string="", id="") {
    this.#id = id;
    this.#x = x;
    this.#y = y;
    this.#string = string.toLowerCase();
    this.#callback = () => {};
  }

  draw() {
    [...this.#string].forEach((char, i) => {
      let sx = char.charCodeAt(0);
      let sy = 240;
      if (char >= 'a' && char <= 'z') {
        sx -= 'a'.charCodeAt(0);
      }
      else if (char >= '0' && char <= '9') {
        sx -= '0'.charCodeAt(0);
        sy += 8;
      }

      Renderer.image(
        "spritesheet",
        sx * TILE_SIZE, sy, TILE_SIZE, TILE_SIZE,
        this.#x + i * TILE_SIZE, this.#y,
        TILE_SIZE, TILE_SIZE
      );
    });
  }

  get id() { return this.#id; }
  get x() { return this.#x; }
  get y() { return this.#y; }
  get string() { return this.#string; }
  get callback() { return this.#callback; }

  set id(id) { this.#id = id; }
  set x(_x) { this.#x = _x; }
  set y(_y) { this.#y = _y; }
  set string(s) { this.#string = s; }
  set callback(cb) { this.#callback = cb; }
};