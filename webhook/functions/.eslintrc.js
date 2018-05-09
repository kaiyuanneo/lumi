module.exports = {
  "extends": "airbnb-base",
  "rules": {
    // The Rewire module uses __get__ and __set__, which Lumi needs to unit test private functions
    // The Node Mocks HTTP module uses _getData to get value returned in response object and
    // _getJSON to verify that data sent in response was defined as JSON
    "no-underscore-dangle": ["error", { "allow": ["__get__", "__set__", "_getData", "_isJSON"] }],
    // This is only necessary for JSX, but also prevents line breaks before function param values.
    // We want to have line breaks before function param values.
    "function-paren-newline": 0,
  }
};
