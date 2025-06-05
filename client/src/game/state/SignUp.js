import Renderer from "../../gfx/Renderer";
import Keyboard from "../../gfx/ui/Keyboard";
import { TILE_SIZE } from "../constants";
import State from "./State";

export default class SignUpState extends State {
  #text;
  #keyboard;

  /**
   * 0 = username
   * 1 = password
   * 2 = done
   */
  #state;

  constructor() {
    super();

    this.#text = {
      username: "",
      password: ""
    };

    this.#state = 0;

    this.#keyboard = new Keyboard(100, 100);
  }

  onEnter() {}
  onExit() {
    this.#text.username = "";
    this.#text.password = "";
  }

  init() {}

  update(dt) {
    this.#keyboard.update(dt);

    // Get username
    if (this.#state === 0) {
      if (this.#keyboard.string !== this.#text.username) {
        this.#text.username = this.#keyboard.string;
      }
      if (this.#keyboard.submitted) {
        if (this.#text.username.length <= 0) {
          this.#keyboard.init();
        }
        else {
          this.#state = 1;
          this.#keyboard.init();
        }
      }
    }
    // Get password
    else if (this.#state === 1) {
      if (this.#keyboard.string !== this.#text.password) {
        this.#text.password = this.#keyboard.string;
      }
      if (this.#keyboard.submitted) {
        if (this.#text.password.length <= 0) {
          this.#keyboard.init();
        }
        else {
          this.#state = 2;
        }
      }
    }
    // Submit to database
    else if (this.#state === 2) {

    }
  }

  render() {
    // Keyboard
    this.#keyboard.draw();

    if (this.#state === 0) {
      [...this.#text.username].forEach((c, x) => {
        Renderer.image(
          "spritesheet",
          ((c.charCodeAt(0) - 'a'.charCodeAt(0)) * 8), 240,
          TILE_SIZE, TILE_SIZE,
          x * TILE_SIZE, 32,
          TILE_SIZE, TILE_SIZE
        );
      });
    }
    else if (this.#state === 1) {
      [...this.#text.password].forEach((c, x) => {
        Renderer.image(
          "spritesheet",
          232, 240,
          TILE_SIZE, TILE_SIZE,
          x * TILE_SIZE, 32,
          TILE_SIZE, TILE_SIZE
        );
      });
    }
  }
};