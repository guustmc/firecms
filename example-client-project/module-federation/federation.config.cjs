const {
  withNativeFederation, shareAll,
} = require("@softarc/native-federation/build");

module.exports = withNativeFederation({
  name: "remote",
  exposes: {
    "./remote-app": "./src/fields/CustomColorTextField.tsx"
  },
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
      includeSecondaries: false,
    }),
  },
});

