import KeyHandler from "../../input/KeyHandler";
import Renderer   from "../Renderer";
import settings   from "../../game/settings";

import { clamp }     from "../../math/utils";
import { TILE_SIZE } from "../../game/constants";

export default class Cursor {
  #x;
  #y;

  #xMin;       // Minimum x position the cursor can reach
  #xMax;       // Maximum x position the cursor can reach
  #yMin;       // Minimum y position the cursor can reach
  #yMax;       // Maximum y position the cursor can reach

  #inputTimer; // Keeps track of the input time
  #inputDelay; // Delay of the input

  #selected;   // Is the cursor in "selected" mode
  #unselected; // Is the cursor in "unselected" mode

  #blink;      // Is the blink effect activated
  #blinkTimer; // Keeps track of the blinker time
  #blinkSpeed; // Speed of the blink effect
  #blinkState; // State of the blink animation

  /**
   * @param {Number}  x          - x position of the cursor
   * @param {Number}  y          - y position of the cursor
   * @param {Number}  xMin       - Minimum x coordinate the cursor can reach
   * @param {Number}  xMax       - Maximum x coordinate the cursor can reach
   * @param {Number}  yMin       - Minimum y coordinate the cursor can reach
   * @param {Number}  yMax       - Maximum y coordinate the cursor can reach
   * @param {Boolean} blink      - Should the cursor blink
   * @param {Number}  blinkSpeed - Speed of the cursor blink
   */
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

    this.#selected   = false;
    this.#unselected = false;

    this.#blink      = blink;
    this.#blinkTimer = 0;
    this.#blinkSpeed = blinkSpeed;
    this.#blinkState = 0;
  }

  /**
   * @brief Updates the cursor
   *
   * @param {Number} dt - Delta time
   */
  update(dt) {
    this.#inputTimer += dt;

    if (
      this.#xMin > 0 ||
      this.#xMax > 0 ||
      this.#yMin > 0 ||
      this.#yMax > 0
    ) {
      // Cursor movement
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

      // Selection mode
      this.#selected   = KeyHandler.isDown(32);
      this.#unselected = KeyHandler.isDown(186);
    }

    // Blink animation
    if (this.#blink) {
      this.#blinkTimer += dt;

      if (this.#blinkTimer >= this.#blinkSpeed) {
        this.#blinkTimer = 0;
        this.#blinkState = !this.#blinkState;
      }
    }
  }

  /**
   * @brief Draws the cursor
   */
  draw() {
    if (this.#blinkState) {
      Renderer.image(
        `${settings.theme}_theme`,
        16, 8, TILE_SIZE, TILE_SIZE,
        this.#x, this.#y, TILE_SIZE, TILE_SIZE
      );
    }
  }

  // Accessors
  get coords() {
    return {
      x: (this.#x - this.#xMin) / TILE_SIZE,
      y: (this.#y - this.#yMin) / TILE_SIZE
    };
  }

  get x()          { return this.#x; }
  get y()          { return this.#y; }
  get selected()   { return this.#selected; }
  get unselected() { return this.#unselected; }

  // Mutators
  set x(_x) { this.#x = _x; }
  set y(_y) { this.#y = _y; }
};