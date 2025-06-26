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

  #puzzleData; // Selected puzzle data
  #shortcuts;
  #puzzles;    // Puzzles retrieved from the database

  #rangeStart; // Starting position to fetch puzzles

  #label_msg;
  #icon_msg;

  #random;     // Should we get a random puzzle

  /**
   * @param {Array}   data   - Puzzle data
   * @param {Boolean} random - Should we get a random puzzle
   */
  constructor(data, random=false) {
    super();

    this.#inputTimer = 0;
    this.#inputDelay = 0.3;

    this.#puzzleData = [...data];

    this.#shortcuts = [];
    this.#puzzles   = [];

    this.#rangeStart = 0;

    this.#label_msg = new Label("", 24, 168);
    this.#icon_msg  = new Icon(8, 168, 24, 8);

    this.#random = random;

    data.forEach((puzzle, i) => {
      this.#puzzles.push(
        new Shortcut(
          8,
          8 + (i<<4), 16,
          new Icon(0, 0, 8, 0),
          new Label(puzzle.title, 0, 0, puzzle.id),
          `${i}`,
          null
        )
      );
    });

    if (!random) {
      this.#shortcuts.push(
        new Shortcut(
          192,
          8, 14,
          new Icon(0, 0, 56, 16),
          new Label("NEXT", 0, 0),
          'n',
          () => {}
        ),
        new Shortcut(
          192,
          24, 14,
          new Icon(0, 0, 48, 16),
          new Label("PREVIOUS", 0, 0),
          'p',
          () => {}
        ),
        new Shortcut(
          192,
          40, 14,
          new Icon(0, 0, 40, 0),
          new Label("RETURN", 0, 0),
          'q',
          () => StateHandler.pop()
        )
      );
    }
    else {
      this.#shortcuts.push(
        new Shortcut(
          192,
          8, 14,
          new Icon(0, 0, 40, 0),
          new Label("RETURN", 0, 0),
          'q',
          () => StateHandler.pop()
        )
      );
    }
  }

  onEnter() {}
  onExit()  {}

  init() {}

  /**
   * @brief Updates the select puzzle state
   *
   * @param {Number} dt - Delta time
   */
  update(dt) {
    this.#inputTimer += dt;

    if (this.#inputTimer >= this.#inputDelay) {
      // 0 - 9
      for (let i = 48; i <= 57; ++i) {
        if (KeyHandler.isDown(i)) {
          StateHandler.pop();
          StateHandler.push(new SolveState(this.#puzzleData[i-48]));
        }
      }
      if (!this.#random) {
        // Next
        if (KeyHandler.isDown(78)) {
          this.#inputTimer = 0;

          this.#rangeStart += 10;

          fetch(`http://localhost:5000/api/puzzles?range=${this.#rangeStart},10`)
            .then(res => res.json())
            .then(data => {
              // Reached the end
              if (data.status === 404) {
                this.#rangeStart -= 10;
                this.#label_msg.string = "Final page reached";
              }
              else if (data.status === 200) {
                this.#label_msg.string = "";
                this.#puzzles = new Array(data.data.length);

                this.#puzzleData = [...data.data];

                data.data.forEach((puzzle, i) => {
                  this.#puzzles[i] =
                    new Shortcut(
                      8,
                      8 + (i<<4), 16,
                      new Icon(0, 0, 8, 0),
                      new Label(puzzle.title, 0, 0, puzzle.id),
                      `${i}`,
                      null
                    );
                });
              }
            })
            .catch(err => {
              if (err.message === "Failed to fetch")
                this.#label_msg.string = "Server may be offline";
            });
        }
        // Previous
        else if (KeyHandler.isDown(80)) {
          this.#inputTimer = 0;

          this.#rangeStart = this.#rangeStart - 10 < 0
            ? 0
            : this.#rangeStart - 10;

          fetch(`http://localhost:5000/api/puzzles?range=${this.#rangeStart},10`)
            .then(res => res.json())
            .then(data => {
              // Already at page 0
              if (data.status === 404)
                this.#label_msg.string = "No puzzles found";
              else if (data.status === 200) {
                this.#label_msg.string = "";
                this.#puzzles = new Array(data.data.length);

                this.#puzzleData = [...data.data];

                data.data.forEach((puzzle, i) => {
                  this.#puzzles[i] =
                    new Shortcut(
                      8,
                      8 + (i<<4), 16,
                      new Icon(0, 0, 8, 0),
                      new Label(puzzle.title, 0, 0, puzzle.id),
                      `${i}`,
                      null
                    );
                });
              }
            })
            .catch(err => {
              if (err.message === "Failed to fetch")
                this.#label_msg.string = "Server may be offline";
            });
        }
      }

      // Quit
      if (KeyHandler.isDown(81)) {
        this.#inputTimer = 0;
        this.#shortcuts[this.#shortcuts.length - 1].callback();
      }
    }
  }

  /**
   * @brief Renders the select puzzle state
   */
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
    this.#puzzles.forEach(puzzle => puzzle.draw());

    if (this.#label_msg.string.length > 0) {
      this.#label_msg.draw();
      this.#icon_msg.draw();
    }
  }
};