const Option = require('./option');
const { noop } = require('./utils');

class Command {
  constructor (controller, name, description) {
    this.controller = controller;
    this.name = name;
    this.description = description;
    this.options = [];
    this.handler = noop;
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
    this.handler = fn;
    return this;
  }

  findOption (arg) {
    return this.options.find(_ => _.is(arg));
  }
}

module.exports = Command;