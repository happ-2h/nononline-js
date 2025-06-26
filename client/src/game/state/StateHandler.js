import State from "./State";

let instance = null;

class _StateHandler {
  #states;

  constructor() {
    if (instance) throw new Error("StateHandler singleton reconstructed");

    this.#states = [];

    instance = null;
  }

  /**
   * @brief Pushes a state to the state stack
   *
   * @param {State} state - State to push
   */
  push(state) {
    if (state instanceof State) {
      state.onEnter();
      this.#states.push(state);
    }
  }

  /**
   * @brief Pops the state at the top of the stack
   */
  pop() {
    this.#states.pop()?.onExit();
  }

  /**
   * @brief Calls the init function of the state at the top of the stack
   */
  init() {
    this.#states[this.#states.length-1]?.init();
  }

  /**
   * @brief Calls the update function of the state at the top of the stack
   *
   * @param {Number} dt - Delta time
   */
  update(dt) {
    this.#states[this.#states.length-1]?.update(dt);
  }

  /**
   * @brief Calls the render function of the state at the top of the stack
   */
  render() {
    this.#states[this.#states.length-1]?.render();
  }

  /**
   * @brief Clears the state stack. Does not call onExit()
   */
  clear() {
    this.#states = [];
  }

  /**
   * @brief Returns the number of states on the stack
   *
   * @returns Number of states on the stack
   */
  length() {
    return this.#states.length;
  }

  // Accessors
  get previous() {
    return this.#states[this.#states.length-2];
  }
};

const StateHandler = new _StateHandler;
export default StateHandler;