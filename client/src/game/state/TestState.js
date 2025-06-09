import Renderer from "../../gfx/Renderer";
import Keyboard from "../../gfx/ui/Keyboard";
import State from "./State";

export default class TestState extends State {
  #keyboard;

  constructor() {
    super();
    this.#keyboard = new Keyboard(100, 100, "number");
  }

  onEnter() {}
  onExit() {}

  init() {}

  update(dt) {
    this.#keyboard.update(dt);
  }

  render() {
    Renderer.imageText(this.#keyboard.string, 50, 32);
    this.#keyboard.draw();
  }
};