module.exports = {
  // Set env to browser to avoid document undefined warning
  "env": {
    "browser": true,
    "jest": true,
    "node": true,
  },
  "extends": "airbnb",
  "plugins": ["jest"],
  "rules": {
    "react/jsx-filename-extension": [true, { "extensions": [".js", ".jsx"] }],
    "import/prefer-default-export": false,
    // We used underscore prefixes to denote private functions exported for test
    "no-underscore-dangle": 0,
  },
};
