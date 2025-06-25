let instance = null;

class _TextureHandler {
  #textures; // Holds all textures

  constructor() {
    if (instance) throw new Error("TextureHandler singleton reconstructed");

    this.#textures = [];

    instance = this;
  }

  /**
   * @brief Loads a texture based on its ID
   *
   * @param {String} textureID - ID given to the texture to refer to
   * @param {String} filename  - File name of the texture
   *
   * @returns Promise: resolve if successfully loaded;
   *                   reject  if failed to load
   */
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

  /**
   * @brief Get the texture based on the given ID
   *
   * @param {String} textureID - ID of the texture
   *
   * @returns Texture if it exists; undefined otherwise
   */
  getTexture(textureID) {
    return this.#textures[textureID];
  }
};

const TextureHandler = new _TextureHandler;
export default TextureHandler;