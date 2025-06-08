import { TILE_SIZE } from "../../game/constants";
import Renderer from "../Renderer";
import Label from "./Label";

export default class Button {
  #x;
  #y;
  #width;
  #height;

  #sx;
  #sy;

  #label;
  #callback;

  constructor(x=0, y=0, width=0, height=0, label="", padx=0, pady=0) {
    this.#x = x;
    this.#y = y;
    this.#width = width;
    this.#height = height;
    this.#sx = 0;
    this.#sy = 216;
    this.#label = new Label(label, x + TILE_SIZE + padx, y + TILE_SIZE + pady);
    this.#callback = () => {};
  }

  draw() {
    this.#drawFrame();
    this.#label.draw();
  }

  #drawFrame() {
    // - Top left
    Renderer.image(
      "spritesheet",
      this.#sx, this.#sy, TILE_SIZE, TILE_SIZE,
      this.#x, this.#y, TILE_SIZE, TILE_SIZE
    );
    // - Top middle
    Renderer.image(
      "spritesheet",
      this.#sx + TILE_SIZE, this.#sy, TILE_SIZE, TILE_SIZE,
      this.#x + TILE_SIZE, this.#y, TILE_SIZE * this.#width, TILE_SIZE
    );
    // - Top right
    Renderer.image(
      "spritesheet",
      this.#sx + 16, this.#sy, TILE_SIZE, TILE_SIZE,
      this.#x + TILE_SIZE * this.#width + TILE_SIZE, this.#y, TILE_SIZE, TILE_SIZE
    );
    // - Middle left
    Renderer.image(
      "spritesheet",
      this.#sx, this.#sy + TILE_SIZE, TILE_SIZE, TILE_SIZE,
      this.#x, this.#y + TILE_SIZE, TILE_SIZE, TILE_SIZE * this.#height
    );
    // - Middle middle
    Renderer.image(
      "spritesheet",
      this.#sx + TILE_SIZE, this.#sy + TILE_SIZE, TILE_SIZE, TILE_SIZE,
      this.#x + TILE_SIZE, this.#y + TILE_SIZE, TILE_SIZE * this.#width, TILE_SIZE * this.#height
    );
    // - Middle right
    Renderer.image(
      "spritesheet",
      this.#sx + 16, this.#sy + TILE_SIZE, TILE_SIZE, TILE_SIZE,
      this.#x + TILE_SIZE * this.#width + TILE_SIZE, this.#y + TILE_SIZE, TILE_SIZE, TILE_SIZE * this.#height
    );
    // - Bottom left
    Renderer.image(
      "spritesheet",
      this.#sx, this.#sy + 16, TILE_SIZE, TILE_SIZE,
      this.#x, this.#y + TILE_SIZE * this.#height + TILE_SIZE, TILE_SIZE, TILE_SIZE
    );
    // - Bottom middle
    Renderer.image(
      "spritesheet",
      this.#sx + TILE_SIZE, this.#sy + 16, TILE_SIZE, TILE_SIZE,
      this.#x + TILE_SIZE, this.#y + TILE_SIZE * this.#height + TILE_SIZE, TILE_SIZE * this.#width, TILE_SIZE
    );
    // - Bottom right
    Renderer.image(
      "spritesheet",
      this.#sx + 16, this.#sy + 16, TILE_SIZE, TILE_SIZE,
      this.#x + TILE_SIZE * this.#width + TILE_SIZE, this.#y + TILE_SIZE * this.#height + TILE_SIZE, TILE_SIZE, TILE_SIZE
    );
  }

  get x() { return this.#x; }
  get y() { return this.#y; }
  get width() { return this.#width; }
  get height() { return this.#height; }
  get label() { return this.#label; }
  get callback() { return this.#callback; }

  set x(x) { this.#x = x; }
  set y(y) { this.#y = y; }
  set width(w) { this.#width = w; }
  set height(h) { this.#height = h; }
  set label(l) { this.#label = l; }
  set padx(px) { this.#label.x = this.#x + TILE_SIZE + px; }
  set pady(py) { this.#label.y = this.#y + TILE_SIZE + py; }
  set callback(cb) { this.#callback = cb; }
};