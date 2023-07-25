const User = require("../model/user");
const crypto = require("crypto");
require("dotenv").config();

/**
 * Adds two numbers together.
 * @param {string} email The email
 * @param {string} credentials The maxAge of token, by default it is 3 hours
 * @param {string} role The role of the user
 * @return {object} The created user
 */
async function createUser(email, credentials, role = "Basic") {
  const user = await User.create({
    email: email,
    credentials: credentials,
    role: role
  });

  return user;
}
/**
 * Gets the users from DB
 * @return {object} The created user
 */
async function getUsers() {
  const users = await User.find();
  return users;
}

generateSecretChallenge = () => {
  return crypto.randomBytes(Number(process.env.SECRET_LENGTH)).toString("hex");
};

module.exports = {
  createUser,
  getUsers,
  generateSecretChallenge
};
