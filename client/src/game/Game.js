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
      .then(val => {
        ThemeHandler.loadUserTheme();
        this.init();
      })
      .catch(err => console.error(err));
  }

  init() {
    Renderer.init(this.#cnv);

    StateHandler.push(new TitleScreenState);
    Network.apiLink = "http://localhost:5000";

    this.update(performance.now());
  }

  update(ts) {
    const dt = (ts - this.#last) / 1000;
    this.#last = ts;

    requestAnimationFrame(this.update.bind(this));

    StateHandler.update(dt);

    this.render(dt);
  }

  render(dt) {
    Renderer.clear(this.#cnv.width, this.#cnv.height);

    StateHandler.render();
  }
};