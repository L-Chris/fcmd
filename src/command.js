const Option = require('./option');
const { noop } = require('./utils');

class Command {
  constructor (controller, name, description) {
    this.controller = controller;
    this.options = [];
    this.handler = noop;
  }

  alias (name) {
    this.alias = name;
    return this;
  }

  option () {
    const option = new Option();
    this.options.push(option);
    return this;
  }

  action (fn) {
    this.handler = fn;
    return this;
  }
}

module.exports = Command;