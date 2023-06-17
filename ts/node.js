const vanilla = require('./vanilla.js');

module.exports = (options) => {
  const config = vanilla(options);
  config.target = 'node';
  return config;
};
