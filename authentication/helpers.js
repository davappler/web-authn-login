const User = require("../model/user");
require("dotenv").config();

/**
 * Adds two numbers together.
 * @param {string} email The email
 * @param {string} hashedPassword The maxAge of token, by default it is 3 hours
 * @param {string} role The role of the user
 * @return {object} The created user
 */
async function createUser(email, hashedPassword, role = "Basic") {
  const user = await User.create({
    email: email,
    password: hashedPassword,
    role: role
  });

  return user;
}

module.exports = { createUser };
