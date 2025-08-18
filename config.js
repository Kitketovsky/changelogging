const path = require("path");

module.exports = {
  PACKAGE_JSON_PATH: path.join(__dirname, "input.json"),
  UPDATES_TXT_PATH: path.join(__dirname, "updates.txt"),
  OUTPUT_JSON_PATH: path.join(__dirname, "data.json"),
};
