import Icon         from "../../gfx/ui/Icon";
import KeyHandler   from "../../input/KeyHandler";
import Label        from "../../gfx/ui/Label";
import Renderer     from "../../gfx/Renderer";
import settings     from "../settings";
import Shortcut     from "../../gfx/ui/Shortcut";
import State        from "./State";
import StateHandler from "./StateHandler";
import ThemeHandler from "../../utils/ThemeHandler";

import { SCREEN_HEIGHT, TILE_SIZE } from "../constants";

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

  /**
   * @brief Updates the settings state
   *
   * @param {Number} dt - Delta time
   */
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

  /**
   * @brief Renders the settings state
   */
  render() {
    StateHandler.previous.render();

    // Background
    Renderer.image(
      `${settings.theme}_theme`,
      0, 56, TILE_SIZE, TILE_SIZE,
      0, 0,
      136,
      SCREEN_HEIGHT
    );

    this.#shortcuts.forEach(shortcut => shortcut.draw());

    // Border
    for (let i = 0; i < SCREEN_HEIGHT / TILE_SIZE; ++i) {
      Renderer.image(
        `${settings.theme}_theme`,
        0, 8, TILE_SIZE, TILE_SIZE,
        128, i<<3,
        TILE_SIZE, TILE_SIZE
      );
    }
  }
};