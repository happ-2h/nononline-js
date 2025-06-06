import Button from "../../gfx/ui/Button";
import State from "./State";

export default class TitleScreenState extends State {
  #btn_play;
  #btn_create;
  #btn_settings;

  constructor() {
    super();

    this.#btn_play = new Button(120, 24, 8, 3, "Play", 16, 5);
    this.#btn_create = new Button(120, 40 + 8*3, 8, 3, "create", 7, 5);
    this.#btn_settings = new Button(120, 40 + 8 * 8, 8, 3, "settings", 0, 5);
  }

  onEnter() {}
  onExit() {}

  init() {}

  update(dt) {}

  render() {
    this.#btn_play.draw();
    this.#btn_create.draw();
    this.#btn_settings.draw();
  }
};