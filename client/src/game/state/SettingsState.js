import Icon         from "../../gfx/ui/Icon";
import KeyHandler   from "../../input/KeyHandler";
import Label        from "../../gfx/ui/Label";
import Renderer     from "../../gfx/Renderer";
import State        from "./State";
import settings     from "../settings";
import Shortcut     from "../../gfx/ui/Shortcut";
import StateHandler from "./StateHandler";

import { SCREEN_HEIGHT, TILE_SIZE } from "../constants";
import ThemeHandler from "../../utils/ThemeHandler";

export default class SettingsState extends State {
  #shortcuts;

  #inputTimer;
  #inputDelay;

  constructor() {
    super();

    this.#inputTimer = 0;
    this.#inputDelay = 0.3;

    this.#shortcuts = [
      new Shortcut(
        8, 8, 14,
        new Icon(0, 0, 32, 0),
        new Label("FULLSCREEN", 16, 0),
        'f',
        () => {
          document.querySelector("canvas")
            .requestFullscreen({ navigationUI: "hide" })
            .catch(err =>
              alert(`Fullscreen failed: ${err.message} (${err.name})`)
            );
        }
      ),
      new Shortcut(
        8, 24, 14,
        new Icon(0, 0, 32, 8),
        new Label("THEME", 0, 0),
        't',
        () => ThemeHandler.next()
      ),
      new Shortcut(
        8, 40, 14,
        new Icon(0, 0, 40, 0),
        new Label("RETURN", 16, 0),
        'q',
        () => StateHandler.pop()
      )
    ];

    document.onfullscreenchange = e => {
      settings.fullscreen = document.fullscreenElement !== null;
    };
  }

  onEnter() {}
  onExit()  {}

  init() {}

  update(dt) {
    this.#inputTimer += dt;

    if (this.#inputTimer >= this.#inputDelay) {
      // Fullscreen
      if (KeyHandler.isDown(70)) {
        this.#inputTimer = 0;
        this.#shortcuts[0].callback();
      }
      // Theme changer
      else if (KeyHandler.isDown(84)) {
        this.#inputTimer = 0;
        this.#shortcuts[1].callback();
      }
      // Return
      else if (KeyHandler.isDown(81)) {
        this.#inputTimer = 0;
        this.#shortcuts[2].callback();
      }
    }
  }

  render() {
    StateHandler.previous.render();

    Renderer.image(
      `${settings.theme}_theme`,
      0, 0, 8, 8,
      0, 0, 17*8, SCREEN_HEIGHT
    );

    this.#shortcuts.forEach(shortcut => shortcut.draw());

    // Border
    for (let i = 0; i < SCREEN_HEIGHT / TILE_SIZE; ++i) {
      Renderer.image(
        `${settings.theme}_theme`,
        0, 8, TILE_SIZE, TILE_SIZE,
        16 * 8, i * 8,
        TILE_SIZE, TILE_SIZE
      );
    }
  }
};