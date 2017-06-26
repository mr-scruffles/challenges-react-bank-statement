module.exports = {
  "parser": "babel-eslint",
  "rules": {
    "strict": 0
  },
  "env": {
    "browser": true,
    "es6": true,
    "jquery": true,
    "node": true,
  },
  "extends": [
    "plugin:jsx-a11y/recommended",
    "airbnb",
    "plugin:jest/recommended",
  ],
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "no-console": 0,
    "no-param-reassign": [
      "error", {
        "props": true,
        "ignorePropertyModificationsFor": ["global"]
      }
    ],
    "no-unused-expressions" : [
      "error", {
        "allowTernary": true
      }
    ],
    "react/forbid-prop-types": [
      2, {
        "forbid": ['any', 'array']
      }
    ],
  },
  "plugins": [
    "react",
    "jsx-a11y", //https://github.com/evcohen/eslint-plugin-jsx-a11y
    "jest",
  ]
};
