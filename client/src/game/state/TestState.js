import Icon       from "../../gfx/ui/Icon";
import KeyHandler from "../../input/KeyHandler";
import Label      from "../../gfx/ui/Label";
import Renderer   from "../../gfx/Renderer";
import settings   from "../settings";
import Shortcut   from "../../gfx/ui/Shortcut";
import State      from "./State";

import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  TILE_SIZE
} from "../constants";

export default class TestState extends State {
  #shortcut_play;
  #shortcut_create;
  #shortcut_settings;

  constructor() {
    super();

    this.#shortcut_play = new Shortcut(
      SCREEN_WIDTH / 4 + 8,
      80,
      17,
      new Icon(0, 0, 8, 0),
      new Label("Play", 0, 0),
      'p',
      () => { console.log(88);}
    );
    this.#shortcut_create = new Shortcut(
      SCREEN_WIDTH / 4 + 8,
      96,
      17,
      new Icon(0, 0, 16, 0),
      new Label("Create", 0, 0),
      'c'
    );
    this.#shortcut_settings = new Shortcut(
      SCREEN_WIDTH / 4 + 8,
      112,
      17,
      new Icon(0, 0, 24, 0),
      new Label("settings", 0, 0),
      's'
    );
  }

  onEnter() {}
  onExit() {}

  init() {}

  update(dt) {
    if (KeyHandler.isDown(80)) {
      this.#shortcut_play.callback();
    }
  }

  render() {
    // Background
    Renderer.image(
      `${settings.theme}_theme`,
      0, 0, TILE_SIZE, TILE_SIZE,
      0, 0,
      SCREEN_WIDTH,
      SCREEN_HEIGHT
    );

    this.#shortcut_play.draw();
    this.#shortcut_create.draw();
    this.#shortcut_settings.draw();
  }
};