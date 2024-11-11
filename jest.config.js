export default {
  transform: {
    "^.+\\.js$": "babel-jest", // use babel-jest to transform JS files
  },
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
};
