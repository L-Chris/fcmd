const pkg = require('../package.json')
const Option = require('./option')
const Command = require('./command')

class Handler {
  constructor () {
    this.options = [];
    this.commands = [];

    this.version(pkg.version);
  }

  option () {
    const option = new Option();
    this.options.push(option);
    return this;
  }

  command (name, description, options) {
    const command = new Command(this, name, description, options);
    this.commands.push(command);
    return command;
  }

  version (str) {
    this._version = str;
    return this;
  }

  description (str) {
    this._description = str;
    return this;
  }
}

module.exports = Handler