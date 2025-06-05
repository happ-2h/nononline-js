import Renderer from "../../gfx/Renderer";
import TextureHandler from "../../gfx/TextureHandler";
import State from "./State";

export default class TestState extends State {
  constructor() { super(); }

  onEnter() {}
  onExit() {}

  init() {}

  update(dt) {}

  render() {
    Renderer.text("Test State", 100, 100);
    Renderer.imageRaw(TextureHandler.getTexture("spritesheet"));
  }
};