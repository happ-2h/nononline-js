import Renderer from "../../gfx/Renderer";
import State from "./State";

export default class TestState extends State {
  constructor() { super(); }

  onEnter() {}
  onExit() {}

  init() {}

  update(dt) {}

  render() {
    Renderer.text("Test State", 100, 100);
  }
};