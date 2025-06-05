let instance = null;

class _TextureHandler {
  #textures; // Holds all textures

  constructor() {
    if (instance) throw new Error("TextureHandler singleton reconstructed");

    this.#textures = [];

    instance = this;
  }

  load(textureID, filename) {
    return new Promise((res, rej) => {
      // Reassign the textureID if it already exists
      if (this.#textures[textureID]) this.#textures[textureID] = null;

      this.#textures[textureID] = new Image();
      this.#textures[textureID].onerror = () => rej(`Failed to load ${filename}`);
      this.#textures[textureID].onload  = () => res(`${filename} loaded`);
      this.#textures[textureID].src = `res/img/${filename}`;
    });
  }

  getTexture(textureID) {
    return this.#textures[textureID];
  }
};

const TextureHandler = new _TextureHandler;
export default TextureHandler;