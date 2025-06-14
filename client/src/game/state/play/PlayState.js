import Cursor            from "../../../gfx/ui/Cursor";
import Label             from "../../../gfx/ui/Label";
import SelectPuzzleState from "./SelectPuzzleState";
import State             from "../State";
import StateHandler      from "../StateHandler";

export default class PlayState extends State {
  #label_top10;
  #label_random;
  #label_recent;
  #label_search;

  #cursor;

  constructor() {
    super();

    this.#label_top10 = new Label("top 10", 90, 0);
    this.#label_top10.callback = () => {
      this.#cursor.timer = 0;
      fetch("http://localhost:5000/api/puzzles?count=10")
        .then(res => res.json())
        .then(data => {
          if (data.status === 200) {
            this.#cursor.timer = 0;
            StateHandler.push(new SelectPuzzleState(data.data));
          }
        })
        .catch(err => console.error(err));
    };

    this.#label_random = new Label("random", 90, 8);
    this.#label_random.callback = () => {
      this.#cursor.timer = 0;
      fetch("http://localhost:5000/api/puzzles?random=1&count=1")
        .then(res => res.json())
        .then(data => {
          if (data.status === 200) {
            this.#cursor.timer = 0;
            StateHandler.push(new SelectPuzzleState([data.data]));
          }
        })
        .catch(err => console.error(err));
    };

    this.#label_recent = new Label("recent", 90, 16);
    this.#label_recent.callback = () => {};

    this.#label_search = new Label("search", 90, 24);
    this.#label_search.callback = () => {};

    this.#cursor = new Cursor(82, 0, 0, 0, 0, 24, 8, 0.3);
  }

  onEnter() {}
  onExit()  {}

  init() {}

  update(dt) {
   this.#cursor.update(dt);

   if (this.#cursor.selected) {
    if (this.#cursor.y === this.#label_top10.y) {
      this.#label_top10.callback();
    }
    else if (this.#cursor.y === this.#label_random.y) {
      this.#label_random.callback();
    }
   }
  }

  render() {
    this.#label_top10.draw();
    this.#label_random.draw();
    this.#label_recent.draw();
    this.#label_search.draw();
    this.#cursor.draw();
  }
};