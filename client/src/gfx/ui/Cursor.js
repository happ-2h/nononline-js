import { TILE_SIZE } from "../../game/constants";
import KeyHandler from "../../input/KeyHandler";
import { clamp } from "../../math/utils";
import Renderer from "../Renderer";

export default class Cursor {
  #x;
  #y;

  #xMin;
  #xMax;
  #yMin;
  #yMax;

  #step;

  #sx;
  #sy;

  #delay;
  #timer;
  #animate;
  #initialX;

  #selected;

  constructor(x=0, y=0, xMin=0, xMax=0, yMin=0, yMax=0, step=8, delay=0.3, animate=true) {
    this.#x = x;
    this.#y = y;
    this.#sx = 0;
    this.#sy = 208;

    this.#xMin = xMin;
    this.#xMax = xMax;
    this.#yMin = yMin;
    this.#yMax = yMax;

    this.#delay = delay;
    this.#timer = 0;
    this.#step = step;
    this.#initialX = x;
    this.#animate = animate;

    this.#selected = false;
  }

  update(dt) {
    this.#timer += dt;
    this.#selected = false;

    if (KeyHandler.isDown(37)) {
      if (this.#timer >= this.#delay) {
        this.#timer = 0;
        this.#x = clamp(this.#x - this.#step, this.#xMin, this.#xMax);
      }
    }
    else if (KeyHandler.isDown(39)) {
      if (this.#timer >= this.#delay) {
        this.#timer = 0;
        this.#x = clamp(this.#x + this.#step, this.#xMin, this.#xMax);
      }
    }
    else if (KeyHandler.isDown(38)) {
      if (this.#timer >= this.#delay) {
        this.#timer = 0;
        this.#y = clamp(this.#y - this.#step, this.#yMin, this.#yMax);
      }
    }
    else if (KeyHandler.isDown(40)) {
      if (this.#timer >= this.#delay) {
        this.#timer = 0;
        this.#y = clamp(this.#y + this.#step, this.#yMin, this.#yMax);
      }
    }
    else if (KeyHandler.isDown(13)) {
      if (this.#timer >= this.#delay) {
        this.#timer = 0;
        this.#selected = true;
      }
    }

    // Animation
    if (this.#animate)
      this.#x = this.#initialX + (4 * Math.cos(this.#timer * 20));
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
  get selected() { return this.#selected; }

  set x(_x) { this.#x = _x; }
  set y(_y) { this.#y = _y; }
  set delay(d) { this.#delay = d; }
  set timer(t) { this.#timer = t; }
};