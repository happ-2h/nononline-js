import Cursor       from "../../gfx/ui/Cursor";
import Label        from "../../gfx/ui/Label";
import State        from "./State";
import StateHandler from "./StateHandler";

import settings from "../settings";
import { TILE_SIZE } from "../constants";

export default class SettingsState extends State {
  #cursor;

  #label_fullscreen;
  #label_return;

  constructor() {
    super();

    this.#cursor = new Cursor(
      56, 16, 56, 56,
      16, 24, 8
    );
    this.#label_fullscreen = new Label("set fullscreen", 64, 16);
    this.#label_fullscreen.callback = () => {
      document.querySelector("canvas")
        .requestFullscreen({ navigationUI: "hide" })
        .catch(err => {
          alert(`Fullscreen failed: ${err.message} (${err.name})`);
        });
    };
    this.#label_return = new Label("return", 64, 24);
    this.#label_return.callback = () => StateHandler.pop();

    document.onfullscreenchange = e => {
      settings.fullscreen = document.fullscreenElement !== null;
    };
  }

  onEnter() {}
  onExit() {}

  init() {}

  update(dt) {
    this.#cursor.update(dt);
    if (this.#cursor.selected) {
      if (this.#cursor.y < this.#label_fullscreen.y + TILE_SIZE) {
        if (!settings.fullscreen) this.#label_fullscreen.callback();
      }
      else if (this.#cursor.y < this.#label_return.y + TILE_SIZE)
        this.#label_return.callback();
    }
  }

  render() {
    this.#label_fullscreen.draw();
    this.#label_return.draw();
    this.#cursor.draw();
  }
};