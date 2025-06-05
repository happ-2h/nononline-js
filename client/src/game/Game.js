export default class Game {
  #last;

  constructor() {
    this.#last = performance.now();

    this.init();
  }

  init() {
    this.update(performance.now());
  }

  update(ts) {
    const dt = (ts - this.#last) / 1000;
    this.#last = ts;

    requestAnimationFrame(this.update.bind(this));

    this.render();
  }

  render() {}
};