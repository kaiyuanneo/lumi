module.exports = {
  // Set env to browser to avoid document undefined warning
  "env": {
    "browser": true,
    "node": true
  },
  "extends": "airbnb",
  "rules": {
    "react/jsx-filename-extension": [true, { "extensions": [".js", ".jsx"] }],
    "import/prefer-default-export": false,
  }
};
