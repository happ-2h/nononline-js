import Label    from "../../gfx/ui/Label";
import Renderer from "../../gfx/Renderer";
import settings from "../settings";
import State    from "./State";

import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  TILE_SIZE
} from "../constants";

export default class TestState extends State {
  #label_fontTest;

  constructor() {
    super();

    this.#label_fontTest = new Label("Common Minimal", 32, 32);
  }

  onEnter() {}
  onExit()  {}

  init() {}

  update(dt) {}

  render() {
    // Background
    Renderer.image(
      `${settings.theme}_theme`,
      0, 56, TILE_SIZE, TILE_SIZE,
      0, 0,
      SCREEN_WIDTH,
      SCREEN_HEIGHT
    );

    this.#label_fontTest.draw();
  }
};