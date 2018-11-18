const Option = require('./option');
const { isFunction, isRegExp, isDef } = require('./utils');

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
    if (name === this.name) throw new Error('Command alias can\'t be the same as its name');
    this._alias = name;
    return this;
  }

  option (name, description, filter, defaultValue) {
    const option = new Option(name, description, filter, defaultValue);

    if (!isFunction(filter)) {
      if (isRegExp(filter)) {
        const regex = filter;
        filter = (val, def) => {
          const m = regex.exec(val);
          return m ? m[0] : def;
        }
      } else {
        defaultValue = filter;
        filter = undefined;
      }
    }

    filter && (option.filter = filter);
    option.defaultValue = defaultValue;

    this.options.push(option);
    return this;
  }

  action (fn) {
    if (!isFunction(fn)) throw new Error('should pass function to action method!');
    this.handlers.push(fn);
    return this;
  }

  async excute (argv, args) {
    for (const option of this.options) {
      const { name, required } = option;
      if (Reflect.has(args, name) && isDef(args[name])) continue;
      if (required) return this.missingArgument(name);
      args[name] = option.defaultValue;
    }

    for (const handler of this.handlers) {
      await handler(argv, args);
    }
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