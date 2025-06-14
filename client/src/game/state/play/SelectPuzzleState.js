import Cursor       from "../../../gfx/ui/Cursor";
import Label        from "../../../gfx/ui/Label";
import SolveState   from "./SolveState";
import State        from "../State";
import StateHandler from "../StateHandler";

export default class SelectPuzzleState extends State {
  #puzzleData;
  #labels;
  #cursor;

  constructor(data) {
    super();
    this.#puzzleData = [...data];
    this.#labels = new Array(this.#puzzleData.length);
    this.#cursor = new Cursor(42, 0, 0, 0, 0, (this.#puzzleData.length-1) * 8, 8, 0.3);

    this.#puzzleData.forEach((puzzle, i) => {
      this.#labels[i] = new Label(puzzle.title, 50, i * 8, puzzle.id);
    });
  }

  onEnter() {}
  onExit()  {}

  init() {}

  update(dt) {
    this.#cursor.update(dt);

    if (this.#cursor.selected) {
      const selectedPuzzle = this.#puzzleData[this.#cursor.y / 8];
      StateHandler.pop();
      StateHandler.push(new SolveState(selectedPuzzle));
    }
  }

  render() {
    this.#labels.forEach(label => label.draw());

    this.#cursor.draw();
  }
};