const { identity } = require('./utils')

class Option {
  constructor (flags, description = '', filter = identity, defaultValue) {
    this.flags = flags;
    this.description = description;
    this.required = /<.+>/.test(flags);
    this.optional = /\[.+\]/.test(flags);
    flags = flags.split(/[ ,|]+/);
    if (flags.length > 1 && !/^[[<]/.test(flags[1])) {
      this.short = flags.shift();
    };
    this.long = flags.shift();
    this.name = this.long.replace(/--/, '');
    this.filter = filter;
    this.defaultValue = defaultValue;
  }

  is (arg) {
    return this.short === arg || this.long === arg
  }
}

module.exports = Option