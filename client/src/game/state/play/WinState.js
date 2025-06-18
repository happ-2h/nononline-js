import Icon         from "../../../gfx/ui/Icon";
import KeyHandler   from "../../../input/KeyHandler";
import Label        from "../../../gfx/ui/Label";
import Renderer     from "../../../gfx/Renderer";
import settings     from "../../settings";
import Shortcut     from "../../../gfx/ui/Shortcut";
import State        from "../State";
import StateHandler from "../StateHandler";

import { TILE_SIZE } from "../../constants";

export default class WinState extends State {
  #shortcuts;
  #label_complete;
  #pixels;
  #inputTimer;
  #inputDelay;

  constructor(pixels) {
    super();

    this.#shortcuts = [
      new Shortcut(
        8, 21*8, 14,
        new Icon(0, 0, 40, 0),
        new Label("RETURN", 0, 0),
        'q',
        () => StateHandler.pop()
      ),
      new Shortcut(
        8*24, 8*21, 14,
        new Icon(0, 0, 56, 8),
        new Label("DOWNLOAD", 0, 0),
        'd',
        () => {}
      )
    ];

    this.#label_complete = new Label("puzzle completed", 8*12, 8*1);

    this.#pixels = pixels;

    this.#inputTimer = 0;
    this.#inputDelay = 0.3;
  }

  onEnter() {}
  onExit()  {}

  init() {}

  update(dt) {
    this.#inputTimer += dt;

    if (this.#inputTimer >= this.#inputDelay) {
      if (KeyHandler.isDown(81)) {
        this.#inputTimer = 0;
        this.#shortcuts[0].callback();
      }
      else if (KeyHandler.isDown(68)) {
        this.#inputTimer = 0;
        this.#shortcuts[1].callback();
      }
    }
  }

  render() {
    this.#label_complete.draw();

    this.#pixels.forEach((row, y) => {
      row.forEach((n, x) => {
        if (n === 1) {
          Renderer.image(
            `${settings.theme}_theme`,
            8, 16, TILE_SIZE, TILE_SIZE,
            13 * 8 + x * TILE_SIZE,
            3 * 8 + y * TILE_SIZE,
            TILE_SIZE, TILE_SIZE
          );
        }
      });
    });

    this.#shortcuts.forEach(shortcut => shortcut.draw());

    Renderer.drawGrid();
  }
};