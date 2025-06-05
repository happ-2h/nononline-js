import Renderer from "../gfx/Renderer";

export default class Game {
  #cnv;  // HTML canvas reference
  #last; // Previous RAF timestamp

  constructor() {
    this.#cnv = document.querySelector("canvas");
    this.#cnv.width = 640;
    this.#cnv.height = 480;
    this.#cnv.autofocus = true;

    this.#last = performance.now();

    this.init();
  }

  init() {
    Renderer.init(this.#cnv);

    this.update(performance.now());
  }

  update(ts) {
    const dt = (ts - this.#last) / 1000;
    this.#last = ts;

    requestAnimationFrame(this.update.bind(this));

    this.render(dt);
  }

  render(dt) {
    Renderer.clear(this.#cnv.width, this.#cnv.height);

    Renderer.text(1/dt, 32, 32);
  }
};