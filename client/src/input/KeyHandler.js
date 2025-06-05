let instance = null;

class _KeyHandler {
  #keys;
  #lastPressed; // Last pressed key code

  constructor() {
    if (instance) throw new Error("KeyHandler singleton reconstructed");

    this.#keys = [];

    onkeydown = this.#keyDown.bind(this);
    onkeyup   = this.#keyDown.bind(this);

    this.#lastPressed = -1;

    instance = this;
  }

  #keyDown(e) {
    e.preventDefault();

    if (e.type === "keydown") this.#lastPressed = e.keyCode;

    /*
     * true:  key is down
     * false: key is up
     */
    this.#keys[e.keyCode] = e.type === "keydown";
  }

  isDown(keycode) {
    return this.#keys[keycode];
  }

  clearLast() {
    this.#lastPressed = -1;
  }

  get lastPressed() { return this.#lastPressed; }
};

const KeyHandler = new _KeyHandler;
export default KeyHandler;