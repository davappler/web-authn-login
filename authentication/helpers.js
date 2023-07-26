const User = require("../model/user");
const Challenge = require("../model/challengeStore");
const crypto = require("crypto");
require("dotenv").config();

/**
 * @param {string} email This is user email
 * @param {string} credentials credentials for authentication
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
 * @param {string} email The email
 * @return {object} The found user
 */
async function getUser(email) {
  const user = await User.find({
    email: email
  });
  return user;
}

/**
 * Gets the users from DB
 * @return {object} The list of users
 */
async function getUsers() {
  const users = await User.find();
  return users;
}

/**
 * @param {string} id is of the user
 * @param {object} credentials credentials for the user
 * @return {object} The updated user
 */
async function addCredentialsForUser(id, credentials) {
  const user = await User.findById(id);
  user.credentials = credentials;
  user.save();
}

/**
 * This generates a random secret challenge
 * @return {string} The created secret challenge key
 */
function generateSecretChallenge() {
  return (
    crypto.randomBytes(Number(8)).toString("hex") +
    "-" +
    crypto.randomBytes(Number(4)).toString("hex") +
    "-" +
    crypto.randomBytes(Number(4)).toString("hex") +
    "-" +
    crypto.randomBytes(Number(4)).toString("hex") +
    "-" +
    crypto.randomBytes(Number(12)).toString("hex")
  );
}

/**
 * Adds a challenge to the challenge collection
 * @param {string} email The email
 * @param {string} challengeKey Radom key
 * @return {object} The created challenge
 */
async function addChallengeToDB(email, challengeKey) {
  const challenge = await Challenge.create({
    email: email,
    challengeKey: challengeKey
  });

  return challenge;
}

/**
 * Gets a challenge from the challenge collection
 * @param {string} email The email
 * @return {object} The found challenge
 */
async function getChallenge(email) {
  const challenge = await Challenge.find({
    email: email
  });
  return challenge;
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  generateSecretChallenge,
  addChallengeToDB,
  getChallenge,
  addCredentialsForUser
};
