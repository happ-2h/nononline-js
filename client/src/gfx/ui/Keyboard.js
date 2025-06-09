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

  constructor(x=0, y=0, type="text") {
    this.#x = x;
    this.#y = y;
    this.#font_y = 8;

    if (type === "number") {
      this.#font_y = 16;
      this.#layout = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['<', '0', '@']
      ];
    }
    else {
      this.#layout = [
        ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
        ['h', 'i', 'j', 'k', 'l', 'm', 'n'],
        ['o', 'p', 'q', 'r', 's', 't', 'u'],
        ['v', 'w', 'x', 'y', 'z', '<', '@']
      ];
    }

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
        this.#cursor.x = clamp(this.#cursor.x - 16, this.#x, this.#x + (this.#layout[0].length-1) * 16);
      }
    }
    else if (KeyHandler.isDown(39)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.x = clamp(this.#cursor.x + 16, this.#x, this.#x + (this.#layout[0].length-1) * 16);
      }
    }
    else if (KeyHandler.isDown(38)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.y = clamp(this.#cursor.y - 16, this.#y, this.#y + (this.#layout.length-1) * 16);
      }
    }
    else if (KeyHandler.isDown(40)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.y = clamp(this.#cursor.y + 16, this.#y, this.#y + (this.#layout.length-1) * 16);
      }
    }

    if (KeyHandler.isDown(13)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;

        const cx = (this.#cursor.x - this.#x) / 16;
        const cy = (this.#cursor.y - this.#y) / 16;
        const char = this.#layout[cy][cx];

        if (
          ((char >= 'a' && char <= 'z')  ||
           (char >= '0' && char <= '9')) &&
          this.#string.length < 10
        )
          this.#string += this.#layout[cy][cx];
        else if (char === '<')
          this.#string = this.#string.slice(0, -1);
        else if (char === '@')
          this.#submitted = true;
      }
    }
  }

  draw() {
    this.#layout.forEach((row, y) => {
      row.forEach((char, x) => {
        let sx = char.charCodeAt(0);
        let sy = this.#font_y;

        if      (char >= 'a' && char <= 'z') sx = (sx - 97)<<3;
        else if (char >= '0' && char <= '9') sx = (sx - 48)<<3;
        else if (char === '<') {
          sx = 208;
          sy = 8;
        }
        else if (char === '@') {
          sx = 216;
          sy = 8;
        }

        // Key
        const cx = (this.#cursor.x - this.#x) / 16;
        const cy = (this.#cursor.y - this.#y) / 16;
        const cchar = this.#layout[cy][cx];

        Renderer.image(
          "spritesheet",
          (char === cchar)<<4, 24, 16, 16,
          this.#x + x * 16,
          this.#y + y * 16,
          16, 16
        );

        // Character
        Renderer.image(
          "spritesheet",
          sx, sy,
          TILE_SIZE, TILE_SIZE,
          this.#x + 5 + x * 16,
          this.#y + 2 + y * 16,
          TILE_SIZE, TILE_SIZE
        );
      });
    });
  }

  get string()    { return this.#string; }
  get submitted() { return this.#submitted; }
};