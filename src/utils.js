exports.camelcase = flag => flag.split('-').reduce(
 (str, word) => str + word[0].toUpperCase() + word.slice(1)
);

exports.exists = file => {
  try {
    if (fs.statSync(file).isFile()) {
      return true;
    }
  } catch(e) {
    return false;
  }
};

exports.noop = () => {};

exports.identity = _ => _;

exports.isFunction = obj => typeof obj === 'function';

exports.isRegExp = obj => obj instanceof RegExp;

exports.isDef = obj => obj !== undefined && obj !== null;