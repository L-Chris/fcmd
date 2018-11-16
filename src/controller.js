const pkg = require('../package.json');
const Option = require('./option');
const Command = require('./command');

const precommandName = 'pre';

class Controller {
  constructor () {
    this.commands = [];

    this.init();
  }

  init () {
    this.version(pkg.version);

    // init precommand
    this.command(precommandName);

    this.option('-h --help [help]', 'get help info');
    this.action((argv, args) => {
      if (Reflect.has(args, 'help')) return this.help();
    });
  }

  get precommand () {
    return this.commands[0];
  }

  option (name, description) {
    const option = new Option(name, description);
    this.precommand.options.push(option);
    return this;
  }

  command (name, description, options) {
    const command = new Command(this, name, description, options);
    this.commands.push(command);
    return command;
  }

  action (fn) {
    this.precommand.action(fn);
    return this;
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

  async excute (command, argv, options) {
    await this.precommand.excute(argv, options);
    command && command.excute(argv, options);
  }

  parseOptions (command, rawOptions) {
    const args = {};
    for (let i = 0; i < rawOptions.length; i += 2) {
      const arg = rawOptions[i];
      const value = rawOptions[i + 1];
      const precommandOption = this.precommand.findOption(arg);
      const commandOption = command && command.findOption(arg);
      precommandOption && (args[precommandOption.name] = value);
      commandOption && (args[commandOption.name] = value);
    }
    return args;
  }

  help () {
    const info = `Usage:\n\n${this.precommand.createOptionHelp()}\n${this.createCommandHelp()}`;
    console.log(info);
    process.exit();
  }

  createCommandHelp () {
    if (!this.commands.length) return '';

    const info = this.commands.slice(1).reduce((pre, val) => {
      pre += `${val.name.padEnd(this.padWidth, ' ')}${val.description}\n`;
      return pre;
    }, '');

    return `Commands:\n${info}`;
  }

  unknownCommand () {
    console.error('error: unknown command');
    process.exit(1);
  }

  get padWidth () {
    const maxCommandLength = this.commands.reduce((pre, val) => {
      pre = val.name.length > pre ? val.name.length : pre;
      return pre;
    }, 0)

    const maxOptionLength = this.precommand.options.reduce((pre, val) => {
      pre = val.flags.length > pre ? val.flags.length : pre;
      return pre
    }, 0)

    return Math.max(maxCommandLength, maxOptionLength) + 5;
  }
}

module.exports = Controller