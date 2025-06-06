import Button from "../../gfx/ui/Button";
import Cursor from "../../gfx/ui/Cursor";
import KeyHandler from "../../input/KeyHandler";
import { clamp } from "../../math/utils";
import { TILE_SIZE } from "../constants";
import State from "./State";

export default class TitleScreenState extends State {
  #btn_play;
  #btn_create;
  #btn_settings;

  #cursor;

  constructor() {
    super();

    this.#btn_play = new Button(120, 24, 8, 3, "Play", 16, 5);
    this.#btn_create = new Button(120, 40 + 8*3, 8, 3, "create", 7, 5);
    this.#btn_settings = new Button(120, 40 + 8 * 8, 8, 3, "settings", 0, 5);

    this.#cursor = new Cursor(120 - TILE_SIZE, 24 + 16, 0.3, 0, 208);
  }

  onEnter() {}
  onExit() {}

  init() {}

  update(dt) {
    this.#cursor.timer += dt;

    if (KeyHandler.isDown(38)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.y = clamp(this.#cursor.y - 40, 24+16, 40 + 8 * 8);
      }
    }
    else if (KeyHandler.isDown(40)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.y = clamp(this.#cursor.y + 40, 24, (40 + 8 * 8) + 16);
      }
    }

    this.#cursor.x = (120 - TILE_SIZE) + (4*Math.cos(this.#cursor.timer * 20));
  }

  render() {
    this.#btn_play.draw();
    this.#btn_create.draw();
    this.#btn_settings.draw();
    this.#cursor.draw();
  }
};