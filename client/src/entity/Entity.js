export default class Entity {
  #x;
  #y;

  constructor(x=0, y=0) {
    if (this.constructor === Entity)
      throw new Error("Can't instantiate abstract class Entity");

    if (this.init === undefined)
      throw new Error("init() must be implemented");
    if (this.update === undefined)
      throw new Error("update(dt) must be implemented");
    if (this.draw === undefined)
      throw new Error("draw() must be implemented");

    this.#x = x;
    this.#y = y;
  }

  get x() { return this.#x; }
  get y() { return this.#y; }

  set x(_x) { this.#x = _x; }
  set y(_y) { this.#y = _y; }
};