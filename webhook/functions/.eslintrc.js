module.exports = {
  "extends": "airbnb-base",
  "rules": {
    // The Rewire module uses __get__ and __set__, which Lumi needs to unit test private functions
    "no-underscore-dangle": ["error", { "allow": ["__get__", "__set__"] }],
  }
};
