import Renderer from "../../gfx/Renderer";
import Button from "../../gfx/ui/Button";
import Cursor from "../../gfx/ui/Cursor";
import KeyHandler from "../../input/KeyHandler";
import { clamp } from "../../math/utils";
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
    else if (KeyHandler.isDown(13)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        if (this.#cursor.y <= this.#btn_play.y + this.#btn_play.height*8) {
          this.#btn_play.callback();
          this.#cursor.timer = 0;
        }
        else if (this.#cursor.y <= this.#btn_create.y + this.#btn_create.height*8) {
          this.#btn_create.callback();
          this.#cursor.timer = 0;
        }
        else if (this.#cursor.y <= this.#btn_settings.y + this.#btn_settings.height*8) {
          this.#btn_settings.callback();
          this.#cursor.timer = 0;
        }
      }

    }

    // Animation
    this.#cursor.x = (120 - TILE_SIZE) + (4*Math.cos(this.#cursor.timer * 20));
  }

  render() {
    this.#btn_play.draw();
    this.#btn_create.draw();
    this.#btn_settings.draw();
    this.#cursor.draw();

    Renderer.imageText("Label test 123,456,7890", 32, 16);
    Renderer.drawGrid();
  }
};