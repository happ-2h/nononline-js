import AssetHandler from "./AssetHandler";

let instance = null;

class _ThemeHandler {
  #themes;

  constructor() {
    if (instance) throw new Error("ThemeHandler singleton reconstructed");

    this.#themes = [];

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

  get themes() { return this.#themes; }
};

const ThemeHandler = new _ThemeHandler;
export default ThemeHandler;