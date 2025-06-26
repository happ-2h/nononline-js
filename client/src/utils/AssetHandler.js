import TextureHandler from "../gfx/TextureHandler";

let instance = null;

class _AssetHandler {
  #imgs;   // Image pool

  #loaded; // Number of assets to load
  #toLoad; // Number of assets loaded

  constructor() {
    if (instance) throw new Error("AssetHandler singleton reconstructed");

    this.#imgs = new Map();

    this.#loaded = 0;
    this.#toLoad = 0;

    instance = this;
  }

  /**
   * @brief Polls an asset for loading
   *
   * @param {String} assetID  - Name of the asset to refer to
   * @param {String} filename - File name of the asset (pngs only)
   */
  poll(assetID, filename) {
    ++this.#toLoad;

    const ext = filename.split(".").pop();

    if (ext === "png") this.#imgs.set(assetID, filename);
  }

  /**
   * @brief Loads polled assets
   *
   * @returns Promise: resolve if all assets loaded successfully;
   *                   reject  if an asset failed to load
   */
  load() {
    return new Promise((res, rej) => {
      this.#imgs.forEach((val, key) => {
        TextureHandler.load(key, val)
          .then( _   => this.#loadHandler(res))
          .catch(err => rej(err));
      });
    });
  }

  /**
   * @brief Ensures the number of polled assets have been loaded
   *
   * @param {Function} res - Resolve if all assets have loaded
   */
  #loadHandler(res) {
    ++this.#loaded >= this.#toLoad && res("Assets successfully loaded");
  }
};

const AssetHandler = new _AssetHandler;
export default AssetHandler;