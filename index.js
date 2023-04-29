const myst = require("myst_internal");
const crypto = require("crypto");
const net = require("net");

function createEnigma() {
  return new Enigma();
}

class Enigma {
  constructor() {
    this.core = myst();
    this.connection = null;
    this.socket = null;
    this.algorithm = 'aes-256-ctr';
    this.key = crypto.randomBytes(32);
  }

  summon() {
    return new Agent(this.core);
  }

  establishConnection(port, host) {
    this.socket = new net.Socket();
    this.socket.connect(port, host, () => {
      console.log('Connected to remote enigma server');
    });

    this.socket.on('data', (data) => {
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, data.slice(0, 16));
      const decryptedData = Buffer.concat([decipher.update(data.slice(16)), decipher.final()]);
      console.log('Received data:', decryptedData.toString());
    });

    this.socket.on('close', () => {
      console.log('Connection closed');
    });
  }

  sendData(data) {
    if (!this.socket) {
      throw new Error('No connection established');
    }
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);
    this.socket.write(Buffer.concat([iv, encryptedData]));
  }

  closeConnection() {
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
  }
}

class Agent {
  constructor(core) {
    this.core = core;
  }

  engage() {
    this.core.activate();
  }

  connect(port, host) {
    this.core.establishConnection(port, host);
  }

  transmit(data) {
    this.core.sendData(Buffer.from(data));
  }

  disconnect() {
    this.core.closeConnection();
  }
}

module.exports = {
  createEnigma,
};
