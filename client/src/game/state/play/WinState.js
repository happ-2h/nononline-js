import Icon         from "../../../gfx/ui/Icon";
import KeyHandler   from "../../../input/KeyHandler";
import Label        from "../../../gfx/ui/Label";
import Renderer     from "../../../gfx/Renderer";
import settings     from "../../settings";
import Shortcut     from "../../../gfx/ui/Shortcut";
import State        from "../State";
import StateHandler from "../StateHandler";

import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  TILE_SIZE
} from "../../constants";

export default class WinState extends State {
  #pixels; // Pixel data to draw

  #shortcuts;
  #label_complete;

  #inputTimer;
  #inputDelay;

  #downloaded; // Did the user download the puzzle

  /**
   * @param {Array} pixels     - Pixel data to draw
   * @param {JSON}  puzzleData - Puzzle data from the database
   */
  constructor(pixels, puzzleData) {
    super();

    this.#pixels     = pixels;
    this.#inputTimer = 0;
    this.#inputDelay = 0.3;
    this.#downloaded = false;

    this.#label_complete = new Label("puzzle completed", 96, 8);

    this.#shortcuts = [
      new Shortcut(
        8, 168, 14,
        new Icon(0, 0, 40, 0),
        new Label("RETURN", 0, 0),
        'q',
        () => StateHandler.pop()
      ),
      new Shortcut(
        192, 168, 14,
        new Icon(0, 0, 56, 8),
        new Label("DOWNLOAD", 0, 0),
        'd',
        () => {
          // Prevent spam download
          if (!this.#downloaded) this.#downloaded = true;
          else return;

          // Prepare data
          // - Magic number + width and height
          const arr = new Uint16Array(2 + puzzleData.width);

          arr[0] = (0x6F<<8) | 0x6E;
          arr[1] = (puzzleData.width<<8) | puzzleData.height;
          puzzleData.puzzle.split(',')
          .map(Number)
          .forEach((n, i) => arr[2 + i] = n);

          // Download
          const blob = new Blob([arr], { type: "application/octet-stream" });

          const url  = window.URL.createObjectURL(blob);
          const el_a = document.createElement("a");
          el_a.href  = url;
          el_a.download = `${puzzleData.title}_${puzzleData.created}.nono`;
          document.body.appendChild(el_a);
          el_a.style.display = "none";
          el_a.click();
          el_a.remove();
        }
      )
    ];
  }

  onEnter() {}
  onExit()  {}

  init() {}

  /**
   * @brief Updates the win state
   *
   * @param {Number} dt - Delta time
   */
  update(dt) {
    this.#inputTimer += dt;

    if (this.#inputTimer >= this.#inputDelay) {
      // Return
      if (KeyHandler.isDown(81)) {
        this.#inputTimer = 0;
        this.#shortcuts[0].callback();
      }
      // Download
      else if (KeyHandler.isDown(68)) {
        this.#inputTimer = 0;
        this.#shortcuts[1].callback();
      }
    }
  }

  /**
   * @brief Renders the win state
   */
  render() {
    // Background
    Renderer.image(
      `${settings.theme}_theme`,
      0, 56, TILE_SIZE, TILE_SIZE,
      0, 0,
      SCREEN_WIDTH,
      SCREEN_HEIGHT
    );

    this.#label_complete.draw();

    this.#pixels.forEach((row, y) => {
      row.forEach((n, x) => {
        if (n === 1) {
          Renderer.image(
            `${settings.theme}_theme`,
            8, 16, TILE_SIZE, TILE_SIZE,
            104 + x * TILE_SIZE,
            24 + y * TILE_SIZE,
            TILE_SIZE, TILE_SIZE
          );
        }
      });
    });

    this.#shortcuts.forEach(shortcut => shortcut.draw());
  }
};