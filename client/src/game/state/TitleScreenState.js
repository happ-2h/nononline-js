import CreateState   from "./CreateState";
import Icon          from "../../gfx/ui/Icon";
import KeyHandler    from "../../input/KeyHandler";
import Label         from "../../gfx/ui/Label";
import PlayState     from "./play/PlayState";
import Renderer      from "../../gfx/Renderer";
import settings      from "../settings";
import SettingsState from "./SettingsState";
import Shortcut      from "../../gfx/ui/Shortcut";
import State         from "./State";
import StateHandler  from "./StateHandler";

import {
  BANNER_HEIGHT,
  BANNER_WIDTH,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../constants";

export default class TitleScreenState extends State {
  #shortcuts;

  #inputTimer;
  #inputDelay;

  constructor() {
    super();

    this.#shortcuts = [
      new Shortcut(
        SCREEN_WIDTH / 4 + 8,
        96,
        17,
        new Icon(0, 0, 8, 0),
        new Label("Play", 0, 0),
        'p',
        () => StateHandler.push(new PlayState)

      ),
      new Shortcut(
        SCREEN_WIDTH / 4 + 8,
        112,
        17,
        new Icon(0, 0, 16, 0),
        new Label("Create", 0, 0),
        'c',
        () => StateHandler.push(new CreateState)
      ),
      new Shortcut(
        SCREEN_WIDTH / 4 + 8,
        128,
        17,
        new Icon(0, 0, 24, 0),
        new Label("Settings", 0, 0),
        's',
        () => StateHandler.push(new SettingsState)
      )
    ];

    this.#inputTimer = 0;
    this.#inputDelay = 0.3;
  }

  onEnter() {}
  onExit() {}

  init() {}

  update(dt) {
    this.#inputTimer += dt;

    if (this.#inputTimer >= this.#inputDelay) {
      if (KeyHandler.isDown(80)) {
        this.#inputTimer = 0;
        this.#shortcuts[0].callback();
      }
      else if (KeyHandler.isDown(67)) {
        this.#inputTimer = 0;
        this.#shortcuts[1].callback();
      }
      else if (KeyHandler.isDown(83)) {
        this.#inputTimer = 0;
        this.#shortcuts[2].callback();
      }
    }
  }

  render() {
    // Background
    Renderer.image(
      `${settings.theme}_theme`,
      0, 56, 8, 8,
      0, 0,
      SCREEN_WIDTH,
      SCREEN_HEIGHT
    );

    this.#shortcuts.forEach(shortcut => shortcut.draw());

    Renderer.image(
      `${settings.theme}_banner`,
      0,0,
      BANNER_WIDTH, BANNER_HEIGHT,
      0,0,
      BANNER_WIDTH, BANNER_HEIGHT
    );
  }
};