import { SCREEN_WIDTH, TILE_SIZE } from "../../game/constants";
import settings from "../../game/settings";
import Renderer from "../Renderer";
import Label from "./Label";

export default class Statusline {
  #x;
  #y;
  #width;
  #height;

  #label_name;
  #label_mode;
  #label_pos;

  constructor(x=0, y=0, width=0, height=0, puzzleName="") {
    this.#x = x;
    this.#y = y;
    this.#width = width;
    this.#height = height;

    this.#label_name = new Label(puzzleName, x, y);
    this.#label_mode = new Label("INSERT", x + 8*13, y);
    this.#label_pos = new Label("00 00", x + 8 * 34, y);
  }

  draw() {
    // Background
    Renderer.image(
      `${settings.theme}_theme`,
      0, 56, TILE_SIZE, TILE_SIZE,
      this.#x,
      this.#y,
      this.#width,
      this.#height
    );

    this.#label_name.draw();
    this.#label_mode.draw();
    this.#label_pos.draw();
  }
};