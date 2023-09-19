const User = require("../model/user");
const Challenge = require("../model/challengeStore");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
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
  user.credentials.push(credentials);
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

/**
 * Gets a challenge from the challenge collection
 * @param {object} challenge The email
 * @return {object} The found challenge
 */
async function deleteChallengeFromDB(challenge) {
  return await Challenge.deleteOne({ email: challenge.email });
}

/**
 * Gets the credentialID from the DB for the user
 * @param {string} email The email
 * @return {object} The found challenge
 */
async function getCredentialFromDb(email) {
  const user = await User.find({
    email: email
  });

  const credential = user[0].credentials[0];
  return credential;
}

/**
 * Generates a JWT token
 * @param {object} user The user
 * @param {int} maxAge The maxAge of token, by default it is 3 hours
 * @param {string} jwtSecret The jwtToken secret, default value is ENV variable
 * @return {string} The token
 */
function generateJwtToken(
  user,
  maxAge = 3 * 60 * 60,
  jwtSecret = process.env.JWT_SECRET
) {
  const token = jwt.sign(
    { id: user[0]._id, username: user[0].email, role: user[0].role },
    jwtSecret,
    { expiresIn: maxAge }
  );

  return token;
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  generateSecretChallenge,
  addChallengeToDB,
  getChallenge,
  addCredentialsForUser,
  deleteChallengeFromDB,
  getCredentialFromDb,
  generateJwtToken
};
