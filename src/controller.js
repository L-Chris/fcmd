const pkg = require('../package.json')
const Option = require('./option')
const Command = require('./command')

class Controller {
  constructor () {
    this.options = [];
    this.commands = [];

    this.version(pkg.version);
  }

  option (name, description) {
    const option = new Option(name, description);
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

  parse (argv) {
    this.rawArgs = argv;
    const [,, name, ...rawOptions] = argv;

    const command = this.commands.find(_ => _.alias() === name || _.name === name);
    const parsedOptions = this.parseOptions(command, rawOptions);
    command.handler(argv, parsedOptions);
  }

  parseOptions (command, rawOptions) {
    const args = {};
    for (let i = 0; i < rawOptions.length; i += 2) {
      const arg = rawOptions[i];
      const value = rawOptions[i + 1];
      const option = command.findOption(arg);
      args[option.name] = value;
    }
    return args;
  }
}

module.exports = Controller