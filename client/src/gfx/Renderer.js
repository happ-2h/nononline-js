import { GAME_SCALE, RES_HEIGHT, RES_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH, TILE_SIZE } from "../game/constants";
import TextureHandler from "./TextureHandler";

let instance = null;

class _Renderer {
  /**@type {CanvasRenderingContext2D} */
  #ctx; // Drawing context

  constructor() {
    if (instance) throw new Error("Renderer singleton reconstructed");

    this.#ctx = null;

    instance = this;
  }

  init(canvas) {
    if (canvas) {
      this.#ctx = canvas.getContext("2d");

      this.#ctx.font = "24px Arial";
      this.#ctx.imageSmoothingEnabled = false;
    }
  }

  clear(width=1, height=1) {
    this.#ctx.clearRect(0, 0, width, height);
  }

  text(text="", x=0, y=0, color="black") {
    this.#ctx.fillStyle = color;
    this.#ctx.fillText(text, x, y);
  }

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

  imageText(text="", x=0, y=0) {
    text = text?.toString()?.toLowerCase();

    text.split('').forEach((c, cx) => {
      let n = c.charCodeAt(0);
      let sy = 240;

      if (c >= 'a' && c <= 'z') n -=  97;
      else if (c >= '0' && c <= '9') {
        n -= 48;
        sy += 8;
      }
      this.image(
        "spritesheet",
        n * TILE_SIZE, sy,
        TILE_SIZE, TILE_SIZE,
        x + cx * TILE_SIZE, y,
        TILE_SIZE, TILE_SIZE
      );
    });
  }

  imageRaw(img, x=0, y=0) {
    this.#ctx.drawImage(img, x, y);
  }

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

  drawGrid() {
    const w = SCREEN_WIDTH / TILE_SIZE;
    const h = SCREEN_HEIGHT / TILE_SIZE;

    for (let x = 0; x < w; ++x) {
      for (let y = 0; y < h; ++y) {
        this.#ctx.strokeStyle = "black";
        this.#ctx.strokeRect(
          x * TILE_SIZE * GAME_SCALE,
          y*TILE_SIZE*GAME_SCALE,
          TILE_SIZE * GAME_SCALE,
          TILE_SIZE * GAME_SCALE
        );
      }
    }
  }
};

const Renderer = new _Renderer;
export default Renderer;