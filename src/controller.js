const pkg = require('../package.json')
const Option = require('./option')
const Command = require('./command')

class Controller {
  constructor () {
    this.options = [];
    this.commands = [];

    this.init()
  }

  init () {
    this.version(pkg.version);
    this.option('-h --help [help]', 'get help info');
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
    const name = argv[2];
    const command = this.commands.find(_ => _.alias() === name || _.name === name);
    if (name.indexOf('-') < 0 && !command) return this.unknownCommand();
    const rawOptions = command ? argv.slice(3) : argv.slice(2);
    const parsedOptions = this.parseOptions(command, rawOptions);
    this.excute(command, argv, parsedOptions);
  }

  parseOptions (command, rawOptions) {
    const commandArgs = {};
    const controllerArgs = {};
    for (let i = 0; i < rawOptions.length; i += 2) {
      const arg = rawOptions[i];
      const value = rawOptions[i + 1];
      const controllerOption = this.findOption(arg);
      const commandOption = command && command.findOption(arg);
      if (controllerOption) {
        controllerArgs[controllerOption.name] = value;
      } else if (commandOption) {
        commandArgs[commandOption.name] = value;
      }
    }
    return { controllerArgs, commandArgs };
  }

  excute (command, argv, { commandArgs, controllerArgs }) {
    for (const option of this.options) {
      const { name, required } = option;
      if (required && (!Reflect.has(controllerArgs, name) || controllerArgs[name] === undefined)) this.missingArgument(name);
    }

    for (const arg in controllerArgs) {
      if (arg === 'help') return this.help();
    }

    command && command.excute(argv, commandArgs);
  }

  help () {
    const info = `Usage:\n\n${this.createOptionHelp()}\n${this.createCommandHelp()}`;
    console.log(info);
    process.exit();
  }

  createOptionHelp () {
    if (!this.options.length) return '';

    const info = this.options.reduce((pre, val) => {
      pre += `${val.flags} ${val.description}\n`;
      return pre;
    }, '')

    return `Options:\n${info}`
  }

  createCommandHelp () {
    if (!this.commands.length) return '';

    const info = this.commands.reduce((pre, val) => {
      pre += `${val.name} ${val.description}\n`
      return pre
    }, '')

    return `Commands:\n${info}`
  }

  unknownCommand () {
    console.error('error: unknown command');
    process.exit(1);
  }

  missingArgument (name) {
    console.error('error: missing required argument `%s', name);
    process.exit(1);
  }

  findOption (arg) {
    return this.options.find(_ => _.is(arg));
  }
}

module.exports = Controller