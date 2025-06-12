import Renderer from "../../../gfx/Renderer";
import Button from "../../../gfx/ui/Button";
import Label from "../../../gfx/ui/Label";
import KeyHandler from "../../../input/KeyHandler";
import { TILE_SIZE } from "../../constants";
import State from "../State";
import StateHandler from "../StateHandler";

export default class WinState extends State {
  #label_complete;
  #btn_playAgain;
  #pixels;

  constructor(pixels) {
    super();

    this.#label_complete = new Label("puzzle completed", 100, 32);
    this.#btn_playAgain = new Button(100, 140, 10, 2, "play again", 0, 1);
    this.#btn_playAgain.callback = () => {
      StateHandler.pop();
    };
    this.#pixels = pixels;
  }

  onEnter() {}
  onExit() {}

  init() {}

  update(dt) {
    if (KeyHandler.isDown(13))
      this.#btn_playAgain.callback();
  }

  render() {
    this.#label_complete.draw();
    this.#btn_playAgain.draw();

    this.#pixels.forEach((row, y) => {
      row.forEach((n, x) => {
        if (n === 1) {
          Renderer.rect(
            120 + x * 8,
            50 + y * 8,
            TILE_SIZE, TILE_SIZE, true
          )
        }
      });
    });
  }
};