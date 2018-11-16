const Option = require('./option');
const { isFunction } = require('./utils');

class Command {
  constructor (controller, name, description, { isDefault = false } = {}) {
    this.controller = controller;
    this.name = name;
    this.description = description;
    this.isDefault = isDefault;
    this.options = [];
    this.handlers = [];
  }

  alias (name) {
    if (arguments.length === 0) return this._alias;
    this._alias = name;
    return this;
  }

  option (name, description) {
    const option = new Option(name, description);
    this.options.push(option);
    return this;
  }

  action (fn) {
    if (!isFunction(fn)) throw new Error('should pass function to action method!');
    this.handlers.push(fn);
    return this;
  }

  excute (argv, args) {
    for (const option of this.options) {
      const { name, required } = option;
      if (required && (!Reflect.has(args, name) || args[name] === undefined)) this.missingArgument(name);
    }
    this.handlers.forEach(h => h(argv, args));
  }

  findOption (arg) {
    return this.options.find(_ => _.is(arg));
  }

  createOptionHelp () {
    if (!this.options.length) return '';

    const info = this.options.reduce((pre, val) => {
      pre += `${val.flags.padEnd(this.controller.padWidth, ' ')}${val.description}\n`;
      return pre;
    }, '');

    return `Options:\n${info}`;
  }

  missingArgument (name) {
    console.error('error: missing required argument %s', name);
    process.exit(1);
  }
}

module.exports = Command;