import State from "./State";

let instance = null;

class _StateHandler {
  #states;

  constructor() {
    if (instance) throw new Error("StateHandler singleton reconstructed");

    this.#states = [];

    instance = null;
  }

  push(state) {
    if (state instanceof State) {
      state.onEnter();
      this.#states.push(state);
    }
  }

  pop() {
    this.#states.pop()?.onExit();
  }

  init() {
    this.#states[this.#states.length-1]?.init();
  }

  update(dt) {
    this.#states[this.#states.length-1]?.update(dt);
  }

  render() {
    this.#states[this.#states.length-1]?.render();
  }

  clear() {
    this.#states = [];
  }

  length() {
    return this.#states.length;
  }
};

const StateHandler = new _StateHandler;
export default StateHandler;