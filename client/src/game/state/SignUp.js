import Renderer from "../../gfx/Renderer";
import { SCREEN_WIDTH, TILE_SIZE } from "../constants";
import State from "./State";

export default class SignUpState extends State {
  #text;
  #cursor;

  constructor() {
    super();

    this.#text = {
      username: "",
      password: ""
    };

    this.#cursor = {
      x: (SCREEN_WIDTH>>1) - 8*4,
      y: 32,
      sx: 208,
      sy: 240
    };
  }

  onEnter() {}
  onExit() {}

  init() {}

  update(dt) {}

  render() {
    // Keyboard
    // A - Z
    for (let i = 0; i < 26; ++i) {
      Renderer.image(
        "spritesheet",
        i * TILE_SIZE, 240,
        TILE_SIZE, TILE_SIZE,
        (SCREEN_WIDTH>>1) - 8*4 + (i&7) * TILE_SIZE,
        32 + ((i>>3)<<3),
        TILE_SIZE, TILE_SIZE
      )
    }

    // Cursor
    Renderer.image(
      "spritesheet",
      this.#cursor.sx, this.#cursor.sy, TILE_SIZE, TILE_SIZE,
      this.#cursor.x,  this.#cursor.y, TILE_SIZE, TILE_SIZE
    );

    // Username
    // Password
  }
};