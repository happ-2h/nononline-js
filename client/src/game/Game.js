import Network          from "../network/Network";
import Renderer         from "../gfx/Renderer";
import StateHandler     from "./state/StateHandler";
import ThemeHandler     from "../utils/ThemeHandler";
import TitleScreenState from "./state/TitleScreenState";

import { WINDOW_HEIGHT, WINDOW_WIDTH } from "./constants";

export default class Game {
  #cnv;  // HTML canvas reference
  #last; // Previous RAF timestamp

  constructor() {
    this.#cnv = document.querySelector("canvas");
    this.#cnv.width  = WINDOW_WIDTH;
    this.#cnv.height = WINDOW_HEIGHT;
    this.#cnv.autofocus = true;

    this.#last = performance.now();

    ThemeHandler.loadList()
      .then(_ => {
        ThemeHandler.loadUserTheme();
        this.init();
      })
      .catch(err => {
        this.#cnv.getContext("2d").font = "20px Arial";
        this.#cnv.getContext("2d").fillText(err, 8, 24);
      });
  }

  /**
   * @brief Initializes the game
   */
  init() {
    Renderer.init(this.#cnv);

    StateHandler.push(new TitleScreenState);
    Network.apiLink = "http://localhost:5000";

    this.update(performance.now());
  }

  /**
   * @brief Updates the game
   *
   * @param {DOMHighResTimeStamp} ts - End time of the previous frame's rendering
   */
  update(ts) {
    const dt   = (ts - this.#last) / 1000;
    this.#last = ts;

    requestAnimationFrame(this.update.bind(this));

    StateHandler.update(dt);

    this.render(dt);
  }

  /**
   * @brief Renders the game
   */
  render() {
    Renderer.clear(this.#cnv.width, this.#cnv.height);

    StateHandler.render();
  }
};