import Label             from "../../../gfx/ui/Label";
import State             from "../State";
import StateHandler      from "../StateHandler";
import Shortcut from "../../../gfx/ui/Shortcut";
import Icon from "../../../gfx/ui/Icon";
import KeyHandler from "../../../input/KeyHandler";
import { SCREEN_HEIGHT, TILE_SIZE } from "../../constants";
import Renderer from "../../../gfx/Renderer";
import settings from "../../settings";

export default class PlayState extends State {
  #shortcuts;

  #inputTimer;
  #inputDelay;


  constructor() {
    super();

    this.#inputTimer = 0;
    this.#inputDelay = 0.3;

    this.#shortcuts = [
      new Shortcut(
        8, 8, 14,
        new Icon(0, 0, 48, 0),
        new Label("TOP 10", 0, 0),
        't',
        () => {}
      ),
      new Shortcut(
        8, 24, 14,
        new Icon(0, 0, 56, 0),
        new Label("RANDOM", 0, 0),
        'r',
        () => {}
      ),
      new Shortcut(
        8, 40, 14,
        new Icon(0, 0, 40, 0),
        new Label("RETURN", 0, 0),
        'q',
        () => StateHandler.pop()
      )
    ];

    /*this.#label_top10 = new Label("TOP 10", 90, 0);
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

    this.#cursor = new Cursor(82, 0, 0, 0, 0, 24, 8, 0.3);*/
  }

  onEnter() {}
  onExit()  {}

  init() {}

  update(dt) {
    this.#inputTimer += dt;

    if (this.#inputTimer >= this.#inputDelay) {
      if (KeyHandler.isDown(81)) {
        this.#inputTimer = 0;
        this.#shortcuts[2].callback();
      }
    }
  }

  render() {
    StateHandler.previous.render();

    Renderer.image(
      `${settings.theme}_theme`,
      0, 0, 8, 8,
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