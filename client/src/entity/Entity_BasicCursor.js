import { TILE_SIZE } from "../game/constants";
import Renderer from "../gfx/Renderer";
import Entity from "./Entity";

export default class Entity_BasicCursor extends Entity {
  #sx;
  #sy;

  constructor(x, y, sx, sy) {
    super(x, y);

    this.#sx = sx;
    this.#sy = sy;
  }

  init() {}

  update(dt) {}

  draw() {
    Renderer.image(
      "spritesheet",
      this.#sx, this.#sy, TILE_SIZE, TILE_SIZE,
      this.x, this.y, TILE_SIZE, TILE_SIZE
    );
  }
};