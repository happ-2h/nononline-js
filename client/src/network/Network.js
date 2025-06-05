let instance = null;

class _Network {
  #apiLink;

  constructor() {
    if (instance) throw new Error("Network singleton reconstructed");

    this.#apiLink = "";

    instance = null;
  }

  async post(endpoint = "", body = {}) {
    const res = await fetch(`${this.#apiLink}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    return res;
  }

  get apiLink() { return this.#apiLink; }

  set apiLink(link) { this.#apiLink = link; }
};

const Network = new _Network;
export default Network;