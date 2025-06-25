import Renderer from "../Renderer";

export default class Shortcut {
  #x;
  #y;
  #width;

  #icon;
  #label;
  #shortcut;
  #callback;

  /**
   * @param {Number}   x        - x position to place the shortcut
   * @param {Number}   y        - y position to place the shortcut
   * @param {Number}   width    - Total width of the shortcut
   * @param {Icon}     icon     - Icon  object
   * @param {Label}    label    - Label object
   * @param {String}   shortcut - Name of the shortcut
   * @param {Function} cb       - Function to call when activated
   */
  constructor(x=0, y=0, width=0, icon=null, label=null, shortcut='', cb=null) {
    this.#x     = x;
    this.#y     = y;
    this.#width = width;

    this.#icon   = icon;
    this.#icon.x = x;
    this.#icon.y = y;

    this.#label   = label;
    this.#label.x = x + 16;
    this.#label.y = y;

    this.#shortcut = shortcut;
    this.#callback = cb;
  }

  /**
   * @brief Draws the shortcut
   */
  draw() {
    this.#icon.draw();
    this.#label.draw();
    Renderer.imageText(this.#shortcut, this.#x + this.#width * 8, this.#y);
  }

  // Accessors
  get callback() { return this.#callback; }
};