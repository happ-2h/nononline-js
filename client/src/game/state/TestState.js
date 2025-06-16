import State    from "./State";
import Shortcut from "../../gfx/ui/Shortcut";
import Icon from "../../gfx/ui/Icon";
import Label from "../../gfx/ui/Label";
import { SCREEN_WIDTH } from "../constants";
import KeyHandler from "../../input/KeyHandler";

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
    this.#shortcut_play.draw();
    this.#shortcut_create.draw();
    this.#shortcut_settings.draw();

    // Renderer.drawGrid();
  }
};