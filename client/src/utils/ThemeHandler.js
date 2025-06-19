import settings from "../game/settings";
import AssetHandler from "./AssetHandler";

let instance = null;

class _ThemeHandler {
  #themes;
  #themeIndex;

  constructor() {
    if (instance) throw new Error("ThemeHandler singleton reconstructed");

    this.#themes = [];
    this.#themeIndex = 0;

    instance = this;
  }

  loadList() {
    return new Promise((res, rej) => {
      fetch("http://localhost:5173/res/img/themes/list.txt")
        .then(response => response.text())
        .then(data => {
          data.split('\n').forEach(str => {
            this.#themes.push(str);

            AssetHandler.poll(`${str}_banner`, `themes/${str}/banner.png`);
            AssetHandler.poll(`${str}_font`,   `themes/${str}/font.png`);
            AssetHandler.poll(`${str}_theme`,  `themes/${str}/theme.png`);
          });

          AssetHandler.load()
            .then(val  => res(val))
            .catch(err => console.error(err));
        })
        .catch(err => rej(`Failed to load theme list: ${err}`));
    });
  }

  loadUserTheme() {
    this.#themeIndex = this.#themes.findIndex(theme => theme === settings.theme);

    if (this.#themeIndex === -1) {
      this.#themeIndex = 0;
      settings.theme = this.#themes[this.#themeIndex];
    }
  }

  next() {
    this.#themeIndex =
      this.#themeIndex + 1 >= this.#themes.length
        ? 0
        : this.#themeIndex + 1;

    settings.theme = this.#themes[this.#themeIndex];
  }

  get themes() { return this.#themes; }
  get themeIndex() { return this.#themeIndex; }
  get currentTheme() { return this.#themes[this.#themeIndex]; }
};

const ThemeHandler = new _ThemeHandler;
export default ThemeHandler;