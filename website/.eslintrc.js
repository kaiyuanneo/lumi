module.exports = {
  // Set env to browser to avoid document undefined warning
  "env": {
    "browser": true,
    "node": true
  },
  "extends": "airbnb",
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
  }
};
