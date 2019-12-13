module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "commonjs": true,
    },
    "extends": [
        "eslint:recommended",
        'plugin:react/recommended'
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "react-native"
    ],
    "rules": {
        "indent": [
            "off",
            "tab"
        ],
        "linebreak-style": [
            "off",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "react/jsx-indent-props": [
            "error",
            4
        ],
        "react/no-direct-mutation-state": 2,
        "no-console": 0,
        "no-debugger": 2,
        "react/prop-types":0
    }
};