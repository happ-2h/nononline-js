import Cursor from "../../../gfx/ui/Cursor";
import Label from "../../../gfx/ui/Label";
import KeyHandler from "../../../input/KeyHandler";
import { clamp } from "../../../math/utils";
import State from "../State";
import StateHandler from "../StateHandler";
import SolveState from "./SolveState";

export default class SelectPuzzleState extends State {
  #puzzleData;
  #labels;
  #cursor;

  constructor(data) {
    super();
    this.#puzzleData = [...data];
    this.#labels = new Array(this.#puzzleData.length);
    this.#cursor = new Cursor(42, 0, 0.3, 0, 208);

    this.#puzzleData.forEach((puzzle, i) => {
      this.#labels[i] = new Label(50, i * 8, puzzle.title, puzzle.id);
    });
  }

  onEnter() {}
  onExit() {}

  init() {}

  update(dt) {
    this.#cursor.timer += dt;

    if (KeyHandler.isDown(38)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.y = clamp(this.#cursor.y - 8, 0, (this.#puzzleData.length-1) * 8);
      }
    }
    else if (KeyHandler.isDown(40)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.y = clamp(this.#cursor.y + 8, 0, (this.#puzzleData.length-1) * 8);
      }
    }

    if (KeyHandler.isDown(13)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;

        const selectedPuzzle = this.#puzzleData[this.#cursor.y / 8];
        StateHandler.pop();
        StateHandler.push(new SolveState(selectedPuzzle));
      }
    }
  }

  render() {
    this.#labels.forEach(label => {
      label.draw();
    });

    this.#cursor.draw();
  }
};