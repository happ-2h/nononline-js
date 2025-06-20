import Icon              from "../../../gfx/ui/Icon";
import KeyHandler        from "../../../input/KeyHandler";
import Label             from "../../../gfx/ui/Label";
import Renderer          from "../../../gfx/Renderer";
import Shortcut          from "../../../gfx/ui/Shortcut";
import SearchState       from "./SearchState";
import SelectPuzzleState from "./SelectPuzzleState";
import settings          from "../../settings";
import State             from "../State";
import StateHandler      from "../StateHandler";

import { SCREEN_HEIGHT, TILE_SIZE } from "../../constants";

export default class PlayState extends State {
  #inputTimer;
  #inputDelay;

  #shortcuts;

  constructor() {
    super();

    this.#inputTimer = 0;
    this.#inputDelay = 0.3;

    this.#shortcuts = [
      new Shortcut(
        8, 8, 14,
        new Icon(0, 0, 48, 0),
        new Label("RECENT", 0, 0),
        't',
        () => {
          fetch("http://localhost:5000/api/puzzles?count=10")
            .then(res => res.json())
            .then(data => {
              if (data.status === 200)
                StateHandler.push(new SelectPuzzleState(data.data))
            })
            .catch(err => console.error(err));
        }
      ),
      new Shortcut(
        8, 24, 14,
        new Icon(0, 0, 56, 0),
        new Label("RANDOM", 0, 0),
        'r',
        () => {
          fetch("http://localhost:5000/api/puzzles?random=1&count=1")
            .then(res => res.json())
            .then(data => {
              if (data.status === 200) {
                StateHandler.push(new SelectPuzzleState([data.data]));
              }
            })
            .catch(err => console.error(err));
        }
      ),
      new Shortcut(
        8, 40, 14,
        new Icon(0, 0, 48, 8),
        new Label("SEARCH", 0, 0),
        's',
        () => StateHandler.push(new SearchState)
      ),
      new Shortcut(
        8, 56, 14,
        new Icon(0, 0, 40, 0),
        new Label("RETURN", 0, 0),
        'q',
        () => StateHandler.pop()
      )
    ];
  }

  onEnter() {}
  onExit()  {}

  init() {}

  update(dt) {
    this.#inputTimer += dt;

    if (this.#inputTimer >= this.#inputDelay) {
      // Top 10
      if (KeyHandler.isDown(84)) {
        this.#inputTimer = 0;
        this.#shortcuts[0].callback();
      }
      // Random
      else if (KeyHandler.isDown(82)) {
        this.#inputTimer = 0;
        this.#shortcuts[1].callback();
      }
      // Search
      else if (KeyHandler.isDown(83)) {
        this.#inputTimer = 0;
        this.#shortcuts[2].callback();
      }
      // Quit
      else if (KeyHandler.isDown(81)) {
        this.#inputTimer = 0;
        this.#shortcuts[3].callback();
      }
    }
  }

  render() {
    StateHandler.previous.render();

    // Background
    Renderer.image(
      `${settings.theme}_theme`,
      0, 56, 8, 8,
      0, 0, 17*8, SCREEN_HEIGHT
    );

    this.#shortcuts.forEach(shortcut => shortcut.draw());

    // Background color
    for (let i = 0; i < SCREEN_HEIGHT / TILE_SIZE; ++i) {
      Renderer.image(
        `${settings.theme}_theme`,
        0, 8, TILE_SIZE, TILE_SIZE,
        16 * 8, i * 8,
        TILE_SIZE, TILE_SIZE
      );
    }
  }
};