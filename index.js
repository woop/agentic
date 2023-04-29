const myst = require("myst_internal");

function createEnigma() {
  return new Enigma();
}

class Enigma {
  constructor() {
    this.core = myst();
  }

  summon() {
    return new Agent(this.core);
  }
}

class Agent {
  constructor(core) {
    this.core = core;
  }

  engage() {
    this.core.activate();
  }
}

module.exports = {
  createEnigma,
};