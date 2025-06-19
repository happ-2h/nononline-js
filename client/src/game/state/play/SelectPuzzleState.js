import Icon         from "../../../gfx/ui/Icon";
import KeyHandler   from "../../../input/KeyHandler";
import Label        from "../../../gfx/ui/Label";
import Renderer     from "../../../gfx/Renderer";
import settings     from "../../settings";
import Shortcut     from "../../../gfx/ui/Shortcut";
import SolveState   from "./SolveState";
import State        from "../State";
import StateHandler from "../StateHandler";

import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../constants";

export default class SelectPuzzleState extends State {
  #inputTimer;
  #inputDelay;

  #puzzleData;
  #shortcuts;

  constructor(data) {
    super();

    this.#inputTimer = 0;
    this.#inputDelay = 0.3;

    this.#puzzleData = [...data];

    this.#shortcuts = [];

    data.forEach((puzzle, i) => {
      this.#shortcuts.push(
        new Shortcut(
          SCREEN_WIDTH / 4 + 16,
          8 + i * 16, 16,
          new Icon(0, 0, 8, 0),
          new Label(puzzle.title, 0, 0, puzzle.id),
          `${i}`,
          null
        )
      );
    });

    this.#shortcuts.push(
      new Shortcut(
        SCREEN_WIDTH / 4 + 16,
        8 + 10 * 16, 16,
        new Icon(0, 0, 40, 0),
        new Label("RETURN", 0, 0),
        'q',
        () => StateHandler.pop()
      )
    );
  }

  onEnter() {}
  onExit()  {}

  init() {}

  update(dt) {
    this.#inputTimer += dt;

    if (this.#inputTimer >= this.#inputDelay) {
      // 0 - 9
      if (KeyHandler.isDown(48)) {
        if (this.#puzzleData[0]) {
          StateHandler.pop();
          StateHandler.push(new SolveState(this.#puzzleData[0]));
        }
      }
      else if (KeyHandler.isDown(49)) {
        if (this.#puzzleData[1]) {
          StateHandler.pop();
          StateHandler.push(new SolveState(this.#puzzleData[1]));
        }
      }
      else if (KeyHandler.isDown(50)) {
        if (this.#puzzleData[2]) {
          StateHandler.pop();
          StateHandler.push(new SolveState(this.#puzzleData[2]));
        }
      }
      else if (KeyHandler.isDown(51)) {
        if (this.#puzzleData[3]) {
          StateHandler.pop();
          StateHandler.push(new SolveState(this.#puzzleData[3]));
        }
      }
      else if (KeyHandler.isDown(52)) {
        if (this.#puzzleData[4]) {
          StateHandler.pop();
          StateHandler.push(new SolveState(this.#puzzleData[4]));
        }
      }
      else if (KeyHandler.isDown(53)) {
        if (this.#puzzleData[5]) {
          StateHandler.pop();
          StateHandler.push(new SolveState(this.#puzzleData[5]));
        }
      }
      else if (KeyHandler.isDown(54)) {
        if (this.#puzzleData[6]) {
          StateHandler.pop();
          StateHandler.push(new SolveState(this.#puzzleData[6]));
        }
      }
      else if (KeyHandler.isDown(55)) {
        if (this.#puzzleData[7]) {
          StateHandler.pop();
          StateHandler.push(new SolveState(this.#puzzleData[7]));
        }
      }
      else if (KeyHandler.isDown(56)) {
        if (this.#puzzleData[8]) {
          StateHandler.pop();
          StateHandler.push(new SolveState(this.#puzzleData[8]));
        }
      }
      else if (KeyHandler.isDown(57)) {
        if (this.#puzzleData[9]) {
          StateHandler.pop();
          StateHandler.push(new SolveState(this.#puzzleData[9]));
        }
      }
      // Quit
      else if (KeyHandler.isDown(81)) {
        this.#inputTimer = 0;
        this.#shortcuts[this.#shortcuts.length - 1].callback();
      }
    }

  }

  render() {
    // Background
    Renderer.image(
      `${settings.theme}_theme`,
      0, 56, 8, 8,
      0, 0,
      SCREEN_WIDTH,
      SCREEN_HEIGHT
    );

    this.#shortcuts.forEach(shortcut => shortcut.draw());
  }
};