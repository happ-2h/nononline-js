import KeyHandler from "../../input/KeyHandler";
import Renderer   from "../Renderer";
import settings   from "../../game/settings";

import { clamp }     from "../../math/utils";
import { TILE_SIZE } from "../../game/constants";

export default class Cursor {
  #x;
  #y;

  #xMin;
  #xMax;
  #yMin;
  #yMax;

  #inputTimer;
  #inputDelay;

  #selected;
  #unselected;

  #blink;
  #blinkTimer;
  #blinkSpeed;
  #blinkState;

  constructor(
    x=0, y=0,
    xMin=0, xMax=0,
    yMin=0, yMax=0,
    blink=false, blinkSpeed=0
  ) {
    this.#x = x;
    this.#y = y;

    this.#xMin = xMin;
    this.#xMax = xMax;
    this.#yMin = yMin;
    this.#yMax = yMax;

    this.#inputTimer = 0;
    this.#inputDelay = 0.2;

    this.#selected = false;
    this.#unselected = false;

    this.#blink = blink;
    this.#blinkTimer = 0;
    this.#blinkSpeed = blinkSpeed;
    this.#blinkState = 0;
  }

  update(dt) {
    this.#inputTimer += dt;

    if (this.#inputTimer >= this.#inputDelay) {
      if (KeyHandler.isDown(37) || KeyHandler.isDown(72)) {
        this.#inputTimer = 0;
        this.#blinkTimer = 0;
        this.#blinkState = 1;
        this.#x = clamp(this.#x - 8, this.#xMin, this.#xMax);
      }
      else if (KeyHandler.isDown(39) || KeyHandler.isDown(76)) {
        this.#inputTimer = 0;
        this.#blinkTimer = 0;
        this.#blinkState = 1;
        this.#x = clamp(this.#x + 8, this.#xMin, this.#xMax);
      }
      else if (KeyHandler.isDown(38) || KeyHandler.isDown(75)) {
        this.#inputTimer = 0;
        this.#blinkTimer = 0;
        this.#blinkState = 1;
        this.#y = clamp(this.#y - 8, this.#yMin, this.#yMax);
      }
      else if (KeyHandler.isDown(40) || KeyHandler.isDown(74)) {
        this.#inputTimer = 0;
        this.#blinkTimer = 0;
        this.#blinkState = 1;
        this.#y = clamp(this.#y + 8, this.#yMin, this.#yMax);
      }
    }

    if (KeyHandler.isDown(32)) {
      this.#selected = true;
    }
    else this.#selected = false;

    if (KeyHandler.isDown(186)) {
      this.#unselected = true;
    }
    else this.#unselected = false;

    if (this.#blink) {
      this.#blinkTimer += dt;

      if (this.#blinkTimer >= this.#blinkSpeed) {
        this.#blinkTimer = 0;
        this.#blinkState = !this.#blinkState;
      }
    }
  }

  draw() {
    if (this.#blinkState) {
      Renderer.image(
        `${settings.theme}_theme`,
        16, 8, TILE_SIZE, TILE_SIZE,
        this.#x, this.#y, TILE_SIZE, TILE_SIZE
      );
    }
  }

  get coords() {
    return {
      x: (this.#x - this.#xMin) / TILE_SIZE,
      y: (this.#y - this.#yMin) / TILE_SIZE
    };
  }

  get x() { return this.#x; }
  get y() { return this.#y; }
  get selected() { return this.#selected; }
  get unselected() { return this.#unselected; }
};