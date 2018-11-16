exports.camelcase = flag => flag.split('-').reduce(
  (str, word) => str + word[0].toUpperCase() + word.slice(1)
);

exports.exists = file => {
  try {
    if (fs.statSync(file).isFile()) {
      return true
    }
  } catch(e) {
    return false
  }
};

exports.noop = () => {};