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

  poll(assetID, filename) {
    ++this.#toLoad;

    const ext = filename.split(".").pop();

    if (ext === "png")
      this.#imgs.set(assetID, filename);
  }

  load() {
    return new Promise((res, rej) => {
      this.#imgs.forEach((val, key) => {
        TextureHandler.load(key, val)
          .then(val  => this.#loadHandler(res))
          .catch(err => rej(err));
      });
    });
  }

  #loadHandler(res) {
    ++this.#loaded >= this.#toLoad && res("Assets successfully loaded");
  }
};

const AssetHandler = new _AssetHandler;
export default AssetHandler;