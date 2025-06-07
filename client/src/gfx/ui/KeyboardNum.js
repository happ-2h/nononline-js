import Cursor from "./Cursor";
import Renderer from "../Renderer";
import { TILE_SIZE } from "../../game/constants";
import KeyHandler from "../../input/KeyHandler";
import { clamp } from "../../math/utils";

export default class KeyboardNum {
  #x;
  #y;
  #layout;
  #cursor;
  #string;
  #submitted;
  #font_y;

  constructor(x=0, y=0) {
    this.#x = x;
    this.#y = y;
    this.#font_y = 248;

    this.#layout = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['<', '0', '@']
    ];

    this.#cursor = new Cursor(x, y);
    this.#string = "";
    this.#submitted = false;
  }

  init() {
    this.#cursor.x = this.#x;
    this.#cursor.y = this.#y;
    this.#string = "";
    this.#submitted = false;
  }

  update(dt) {
    if (this.#submitted) return;

    this.#cursor.timer += dt;

    if (KeyHandler.isDown(37)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.x = clamp(this.#cursor.x - 8, this.#x, this.#x + (this.#layout[0].length-1) * TILE_SIZE);
      }
    }
    else if (KeyHandler.isDown(39)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.x = clamp(this.#cursor.x + 8, this.#x, this.#x + (this.#layout[0].length-1) * TILE_SIZE);
      }
    }
    else if (KeyHandler.isDown(38)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.y = clamp(this.#cursor.y - 8, this.#y, this.#y + (this.#layout.length-1) * TILE_SIZE);
      }
    }
    else if (KeyHandler.isDown(40)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.y = clamp(this.#cursor.y + 8, this.#y, this.#y + (this.#layout.length-1) * TILE_SIZE);
      }
    }

    if (KeyHandler.isDown(13)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;

        const cx = (this.#cursor.x - this.#x) / TILE_SIZE;
        const cy = (this.#cursor.y - this.#y) / TILE_SIZE;
        const char = this.#layout[cy][cx];

        if (char >= '0' && char <= '9' && this.#string.length < 10) {
          this.#string += this.#layout[cy][cx];
        }
        else if (char === '<') {
          this.#string = this.#string.slice(0, -1);
        }
        else if (char === '@') {
          this.#submitted = true;
        }
      }
    }
  }

  draw() {
    this.#layout.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col >= '0' && col <= '9') {
          const sx = col.charCodeAt(0) - '0'.charCodeAt(0);
          Renderer.image(
            "spritesheet",
            sx<<3, this.#font_y,
            TILE_SIZE, TILE_SIZE,
            this.#x + (x * TILE_SIZE), this.#y + (y * TILE_SIZE),
            TILE_SIZE, TILE_SIZE
          )
        }
        else if (col === '<') {
          Renderer.image(
            "spritesheet",
            216, 240, TILE_SIZE, TILE_SIZE,
            this.#x + x * TILE_SIZE, this.#y + y * TILE_SIZE,
            TILE_SIZE, TILE_SIZE
          )
        }
        else if (col === '@') {
          Renderer.image(
            "spritesheet",
            224, 240, TILE_SIZE, TILE_SIZE,
            this.#x + x * TILE_SIZE, this.#y + y * TILE_SIZE,
            TILE_SIZE, TILE_SIZE
          )
        }
      });
    });

    this.#cursor.draw();
  }

  get string()    { return this.#string; }
  get submitted() { return this.#submitted; }
};