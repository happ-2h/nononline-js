import Renderer from "../Renderer";

export default class Label {
  #id;
  #x;
  #y;
  #string;

  #callback;

  /**
   * @param {String} string - String of the label
   * @param {Number} x      - x position to place the label
   * @param {Number} y      - y position to place the label
   * @param {String} id     - ID of the label
   */
  constructor(string="", x=0, y=0, id="") {
    this.#id = id;
    this.#x  = x;
    this.#y  = y;
    this.#string   = string;
    this.#callback = () => {};
  }

  /**
   * @brief Draws the label
   */
  draw() {
    Renderer.imageText(this.#string, this.#x, this.#y);
  }

  // Accessors
  get id()       { return this.#id; }
  get x()        { return this.#x; }
  get y()        { return this.#y; }
  get string()   { return this.#string; }
  get callback() { return this.#callback; }

  // Mutators
  set id(id)       { this.#id = id; }
  set x(_x)        { this.#x  = _x; }
  set y(_y)        { this.#y  = _y; }
  set string(s)    { this.#string   = s; }
  set callback(cb) { this.#callback = cb; }
};