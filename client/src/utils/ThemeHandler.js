import AssetHandler from "./AssetHandler";
import settings     from "../game/settings";

let instance = null;

class _ThemeHandler {
  #themes;     // Names of loaded themes
  #themeIndex; // Currently loaded theme

  constructor() {
    if (instance) throw new Error("ThemeHandler singleton reconstructed");

    this.#themes     = [];
    this.#themeIndex = 0;

    instance = this;
  }

  /**
   * @brief Loads and reads the list of themes (res/themes/list.txt)
   *
   * @returns Promise: resolve if read successfully;
   *                   reject  if read failed or assets failed to load
   */
  loadList() {
    return new Promise((res, rej) => {
      fetch("http://localhost:5173/res/themes/list.txt")
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
            .catch(err => rej(`Failed to load assets: ${err}`));
        })
        .catch(err => rej(`Failed to load theme list: ${err}`));
    });
  }

  /**
   * @brief Loads the theme set by the user (src/game/settings.js:3)
   */
  loadUserTheme() {
    // Get theme defined in settings
    this.#themeIndex =
      this.#themes.findIndex(theme => theme === settings.theme);

    // Revert to default if not found
    if (this.#themeIndex === -1) {
      this.#themeIndex = this.#themes.findIndex(theme => theme === "default");
      settings.theme   = this.#themes[this.#themeIndex];
    }
  }

  /**
   * @brief Sets the next theme
   */
  next() {
    this.#themeIndex =
      this.#themeIndex + 1 >= this.#themes.length
        ? 0
        : this.#themeIndex + 1;

    settings.theme = this.#themes[this.#themeIndex];
  }

  // Accessors
  get themes()       { return this.#themes; }
  get themeIndex()   { return this.#themeIndex; }
  get currentTheme() { return this.#themes[this.#themeIndex]; }
};

const ThemeHandler = new _ThemeHandler;
export default ThemeHandler;