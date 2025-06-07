import Cursor from "../../../gfx/ui/Cursor";
import Label from "../../../gfx/ui/Label";
import KeyHandler from "../../../input/KeyHandler";
import { clamp } from "../../../math/utils";
import State from "../State";
import StateHandler from "../StateHandler";
import SelectPuzzleState from "./SelectPuzzleState";

export default class PlayState extends State {
  #label_top10;
  #label_random;
  #label_recent;
  #label_search;

  #cursor;

  constructor() {
    super();

    this.#label_top10 = new Label(90, 0, "Top 10");
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

    this.#label_random = new Label(90, 8, "random");
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

    this.#label_recent = new Label(90, 16, "recent");
    this.#label_recent.callback = () => {};

    this.#label_search = new Label(90, 24, "search");
    this.#label_search.callback = () => {};

    this.#cursor = new Cursor(82, 0, 0.3, 0, 208);
  }

  onEnter() {}
  onExit() {}

  init() {}

  update(dt) {
    this.#cursor.timer += dt;

    if (KeyHandler.isDown(38)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.y = clamp(this.#cursor.y - 8, 0, 24);
      }
    }
    else if (KeyHandler.isDown(40)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;
        this.#cursor.y = clamp(this.#cursor.y + 8, 0, 24);
      }
    }
    else if (KeyHandler.isDown(13)) {
      if (this.#cursor.timer >= this.#cursor.delay) {
        this.#cursor.timer = 0;

        if (this.#cursor.y === this.#label_top10.y) {
          this.#label_top10.callback();
        }
        else if (this.#cursor.y === this.#label_random.y) {
          this.#label_random.callback();
        }
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