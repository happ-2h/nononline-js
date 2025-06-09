import Button from "../../gfx/ui/Button";
import Cursor from "../../gfx/ui/Cursor";
import { TILE_SIZE } from "../constants";
import CreateState from "./CreateState";
import PlayState from "./play/PlayState";
import SettingsState from "./SettingsState";
import State from "./State";
import StateHandler from "./StateHandler";

export default class TitleScreenState extends State {
  #btn_play;
  #btn_create;
  #btn_settings;

  #cursor;

  constructor() {
    super();

    this.#btn_play = new Button(120, 24, 8, 3, "Play", 16, 5);
    this.#btn_play.callback = () => {
      this.#cursor.timer = 0;
      StateHandler.push(new PlayState);
     }
    this.#btn_create = new Button(120, 40 + 8*3, 8, 3, "create", 7, 5);
    this.#btn_create.callback = () => {
      this.#cursor.timer = 0;
      StateHandler.push(new CreateState);
    }
    this.#btn_settings = new Button(120, 40 + 8 * 8, 8, 3, "settings", 0, 5);
    this.#btn_settings.callback = () => {
      this.#cursor.timer = 0;
      StateHandler.push(new SettingsState);
    }

    this.#cursor = new Cursor(
      120 - TILE_SIZE,
      24 + 14,
      120-TILE_SIZE, 120-TILE_SIZE,
      24 + 14, (40 + 8 * 8) + 14,
      40, 0.3, true
    );
  }

  onEnter() {}
  onExit() {}

  init() {}

  update(dt) {
    this.#cursor.update(dt);

    if (this.#cursor.selected) {
      if (this.#cursor.y <= this.#btn_play.y + this.#btn_play.height*8)
        this.#btn_play.callback();
      else if (this.#cursor.y <= this.#btn_create.y + this.#btn_create.height*8)
        this.#btn_create.callback();
      else if (this.#cursor.y <= this.#btn_settings.y + this.#btn_settings.height*8)
        this.#btn_settings.callback();
    }
  }

  render() {
    this.#btn_play.draw();
    this.#btn_create.draw();
    this.#btn_settings.draw();
    this.#cursor.draw();
  }
};