import { TILE_SIZE } from "../../game/constants";
import KeyHandler from "../../input/KeyHandler";
import { clamp } from "../../math/utils";
import Renderer from "../Renderer";
import Cursor from "./Cursor";

export default class Keyboard {
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
    this.#font_y = 240;

    this.#layout = [
      ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
      ['h', 'i', 'j', 'k', 'l', 'm', 'n'],
      ['o', 'p', 'q', 'r', 's', 't', 'u'],
      ['v', 'w', 'x', 'y', 'z', '<', '@']
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

        if (char >= 'a' && char <= 'z' && this.#string.length < 10) {
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
        if (col >= 'a' && col <= 'z') {
          const sx = col.charCodeAt(0) - 'a'.charCodeAt(0);
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
            216, this.#font_y, TILE_SIZE, TILE_SIZE,
            this.#x + x * TILE_SIZE, this.#y + y * TILE_SIZE,
            TILE_SIZE, TILE_SIZE
          )
        }
        else if (col === '@') {
          Renderer.image(
            "spritesheet",
            224, this.#font_y, TILE_SIZE, TILE_SIZE,
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