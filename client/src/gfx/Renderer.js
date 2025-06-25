import settings       from "../game/settings";
import TextureHandler from "./TextureHandler";

import {
  GAME_SCALE,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  TILE_SIZE
} from "../game/constants";

let instance = null;

class _Renderer {
  /**@type {CanvasRenderingContext2D} */
  #ctx; // Drawing context

  constructor() {
    if (instance) throw new Error("Renderer singleton reconstructed");

    this.#ctx = null;

    instance = this;
  }

  /**
   * @brief Initializes the rendering context
   *
   * @param {HTMLCanvasElement} canvas - Canvas to draw on
   */
  init(canvas) {
    if (canvas) {
      this.#ctx = canvas.getContext("2d");

      this.#ctx.font = "24px Arial";
      this.#ctx.imageSmoothingEnabled = false;
    }
  }

  /**
   * @brief Clears an area of the canvas from (0, 0) to (width, height)
   *
   * @param {Number} width  - Width  of area to clear
   * @param {Number} height - Height of area to clear
   */
  clear(width=1, height=1) {
    this.#ctx.clearRect(0, 0, width, height);
  }

  /**
   * @brief Renders text to the canvas (from the HTML5 API)
   *
   * @param {String} text  - Text to render
   * @param {Number} x     - x position
   * @param {Number} y     - y position
   * @param {String} color - Color to render the text
   */
  text(text="", x=0, y=0, color="black") {
    this.#ctx.fillStyle = color;
    this.#ctx.fillText(text, x, y);
  }

  /**
   * @brief Draws a clipped image from the given texture
   *
   * @param {String} textureID - ID of texture to use
   * @param {Number} sx        - Source image x position
   * @param {Number} sy        - Source image y position
   * @param {Number} sw        - Source width  to clip
   * @param {Number} sh        - Source height to clip
   * @param {Number} dx        - Destination x position to draw to
   * @param {Number} dy        - Destination y position to draw to
   * @param {Number} dw        - Destination width  to draw to
   * @param {Number} dh        - Destination height to draw to
   */
  image(textureID, sx=0, sy=0, sw=TILE_SIZE, sh=TILE_SIZE, dx=0, dy=0, dw=TILE_SIZE, dh=TILE_SIZE) {
    this.#ctx.drawImage(
      TextureHandler.getTexture(textureID),
      sx, sy, sw, sh,
      Math.floor(dx) * GAME_SCALE,
      Math.floor(dy) * GAME_SCALE,
      dw * GAME_SCALE,
      dh * GAME_SCALE
    );
  }

  /**
   * @brief Renders text from a font texture
   *
   * @param {String}  text  - Text to render
   * @param {Number}  x     - x position to draw text
   * @param {Number}  y     - y position to draw text
   * @param {Boolean} small - Should it render small numbers
   */
  imageText(text="", x=0, y=0, small=false) {
    text = text?.toString();

    text.split('').forEach((c, cx) => {
      let n  = c.charCodeAt(0);
      let sy = 0;

      if (c >= 'A' && c <= 'Z') n -=  65;
      else if (c >= 'a' && c <= 'z') {
        n -=  97;
        sy = 8;
      }
      else if (c >= '0' && c <= '9') {
        n -= 48;
        sy = 16;
      }

      if (!small) {
        this.image(
          `${settings.theme}_font`,
          n * TILE_SIZE, sy,
          TILE_SIZE, TILE_SIZE,
          x + cx * TILE_SIZE, y,
          TILE_SIZE, TILE_SIZE
        );
      }
      else {
        this.image(
          `${settings.theme}_font`,
          80 + n * 4, sy,
          4, 4,
          x + cx * 4, y,
          4, 4
        );
      }
    });
  }

  /**
   * @brief Draws a rectangle
   *
   * @param {Number}  x      - x position to place the rectangle
   * @param {Number}  y      - y position to place the rectangle
   * @param {Number}  width  - Width  of the rectangle
   * @param {Number}  height - Height of the rectangle
   * @param {Boolean} filled - Should the rectangle be filled
   * @param {String}  color  - Color of the rectangle
   */
  rect(x=0, y=0, width=0, height=0, filled=true, color="black") {
    if (filled) {
      this.#ctx.fillStyle = color;
      this.#ctx.fillRect(
        x * GAME_SCALE,
        y * GAME_SCALE,
        width  * GAME_SCALE,
        height * GAME_SCALE,
      );
    }
    else {
      this.#ctx.strokeStyle = color;
      this.#ctx.strokeRect(
        x * GAME_SCALE,
        y * GAME_SCALE,
        width  * GAME_SCALE,
        height * GAME_SCALE,
      );
    }
  }

  /**
   * @brief Draws a grid based on the game screen dimensions
   */
  drawGrid() {
    const w = SCREEN_WIDTH  / TILE_SIZE;
    const h = SCREEN_HEIGHT / TILE_SIZE;

    for (let x = 0; x < w; ++x) {
      for (let y = 0; y < h; ++y) {
        this.#ctx.strokeStyle = "black";
        this.#ctx.strokeRect(
          x * TILE_SIZE * GAME_SCALE,
          y * TILE_SIZE * GAME_SCALE,
          TILE_SIZE * GAME_SCALE,
          TILE_SIZE * GAME_SCALE
        );
      }
    }
  }
};

const Renderer = new _Renderer;
export default Renderer;