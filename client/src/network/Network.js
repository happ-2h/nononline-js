let instance = null;

class _Network {
  #apiLink; // Link to the API

  constructor() {
    if (instance) throw new Error("Network singleton reconstructed");

    this.#apiLink = "";

    instance = null;
  }

  /**
   * @brief Send a POST request to the API endpoint
   *
   * @param {String} endpoint - API endpoint
   * @param {JSON}   body     - Data to post
   *
   * @returns Response based on the outcome of the POST request
   */
  async post(endpoint="", body={}) {
    const res = await fetch(`${this.#apiLink}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    return res;
  }

  // Accessors
  get apiLink() { return this.#apiLink; }

  // Mutators
  set apiLink(link) { this.#apiLink = link; }
};

const Network = new _Network;
export default Network;