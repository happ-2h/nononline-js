import Cursor from "../../gfx/ui/Cursor";
import Label from "../../gfx/ui/Label";
import KeyHandler from "../../input/KeyHandler";
import { clamp } from "../../math/utils";
import { TILE_SIZE } from "../constants";
import settings from "../settings";
import State from "./State";
import StateHandler from "./StateHandler";

export default class SettingsState extends State {
  #cursor;

  #label_fullscreen;
  #label_return;

  constructor() {
    super();

    this.#cursor = new Cursor(56, 16, 0.3, 0, 208);
    this.#label_fullscreen = new Label(64, 16, "set fullscreen");
    this.#label_fullscreen.callback = () => {
      document.querySelector("canvas")
        .requestFullscreen({ navigationUI: "hide" })
        .catch(err => {
          alert(`Fullscreen failed: ${err.message} (${err.name})`);
        });
    };
    this.#label_return = new Label(64, 24, "return");
    this.#label_return.callback = () => StateHandler.pop();

    document.onfullscreenchange = e => {
      settings.fullscreen = document.fullscreenElement !== null;
    };
  }

  onEnter() {}
  onExit() {}

  init() {}

  update(dt) {
    this.#cursor.timer += dt;

    if (KeyHandler.isDown(38)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.y = clamp(this.#cursor.y - 8, 16, 24);
      }
    }
    else if (KeyHandler.isDown(40)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.y = clamp(this.#cursor.y + 8, 16, 24);
      }
    }
    else if (KeyHandler.isDown(13)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;

        if (this.#cursor.y < this.#label_fullscreen.y + TILE_SIZE) {
          if (!settings.fullscreen)
            this.#label_fullscreen.callback();
        }
        else if (this.#cursor.y < this.#label_return.y + TILE_SIZE) {
          this.#label_return.callback();
        }
      }
    }
  }

  render() {
    this.#label_fullscreen.draw();
    this.#label_return.draw();
    this.#cursor.draw();
  }
};