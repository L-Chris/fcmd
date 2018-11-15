const { camelcase } = require('./utils.js');

class Option {
  constructor (flags, description = '') {
    this.flags = flags;
    this.description = description;
    this.required = /<.+>/.test(flags);
    this.optional = /\[.+\]/.test(flags);
    this.bool = flags.indexOf('-no-') === -1;
    flags = flags.split(/[ ,|]+/);
    if (flags.length > 1 && !/^[[<]/.test(flags[1])) {
      this.short = flags.shift();
    };
    this.long = flags.shift();
  }

  name () {
    return this.long.replace(/--|no-/, '');
  }

  attributeName () {
    return camelcase(this.name);
  }

  is (arg) {
    return this.short === arg || this.long === arg
  }
}

module.exports = Option