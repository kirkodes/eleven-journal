// index.js file centralizes the imports of our current and future models
const UserModel = require("./user");
const JournalModel = require("./journal");

module.exports = { 
    UserModel,
    JournalModel
}