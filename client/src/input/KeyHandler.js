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

  /**
   * @brief Handle what happens when a key is pressed
   *
   * @param {KeyboardEvent} e - Object holding the event details
   */
  #keyDown(e) {
    e.preventDefault();

    if (e.type === "keydown") this.#lastPressed = e.keyCode;

    /*
     * true:  key is down
     * false: key is up
     */
    this.#keys[e.keyCode] = e.type === "keydown";
  }

  /**
   * @brief Checks if the given keycode key is down
   *
   * @param {Number} keycode - Keycode value
   *
   * @returns True if key is down; false otherwise
   */
  isDown(keycode) {
    return this.#keys[keycode];
  }

  /**
   * @brief Clears the last keypressed value
   */
  clearLast() {
    this.#lastPressed = -1;
  }

  // Accessors
  get lastPressed() { return this.#lastPressed; }
};

const KeyHandler = new _KeyHandler;
export default KeyHandler;