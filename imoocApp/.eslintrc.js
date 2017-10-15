module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "browser": true,
    },
    "globals": {
        "Platform": true
    },
    "parser": "babel-eslint", 
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:import/errors",
        "plugin:import/warnings"
    ],
    "parserOptions": {
        "ecmaVersion": 2017,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true,
        },
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "import"
    ],
    "rules": {
        "no-case-declarations": 0,
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "no-console": ["error", { allow: ["warn", "error", "log"] }],
        "space-before-function-paren": ["error", {
            "anonymous": "always",
            "named": "always",
            "asyncArrow": "always"
        }],
        "require-await": "error",
        "react/display-name": 0
    }
};