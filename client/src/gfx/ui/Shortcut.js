import Renderer from "../Renderer";

export default class Shortcut {
  #x;
  #y;
  #width;

  #icon;
  #label;
  #shortcut;
  #callback;

  constructor(x=0, y=0, width=0, icon=null, label=null, shortcut='', cb=null) {
    this.#x = x;
    this.#y = y;
    this.#width  = width;

    this.#icon = icon;
    this.#icon.x = x;
    this.#icon.y = y;

    this.#label = label;
    this.#label.x = x + 16;
    this.#label.y = y;
    this.#shortcut = shortcut;

    this.#callback = cb;
  }

  draw() {
    this.#icon.draw();
    this.#label.draw();
    Renderer.imageText(this.#shortcut, this.#x + this.#width * 8, this.#y);
  }

  get callback() { return this.#callback; }
};