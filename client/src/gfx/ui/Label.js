import Renderer from "../Renderer";

export default class Label {
  #id;
  #x;
  #y;
  #string;

  #callback;

  constructor(string="", x=0, y=0, id="") {
    this.#id = id;
    this.#x  = x;
    this.#y  = y;
    this.#string = string.toLowerCase();
    this.#callback = () => {};
  }

  draw() {
    Renderer.imageText(this.#string, this.#x, this.#y);
  }

  get id()       { return this.#id; }
  get x()        { return this.#x; }
  get y()        { return this.#y; }
  get string()   { return this.#string; }
  get callback() { return this.#callback; }

  set id(id)       { this.#id = id; }
  set x(_x)        { this.#x  = _x; }
  set y(_y)        { this.#y  = _y; }
  set string(s)    { this.#string = s; }
  set callback(cb) { this.#callback = cb; }
};