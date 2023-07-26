const bcrypt = require("bcryptjs");
const User = require("../model/user");

require("dotenv").config();

const {
  getUsers,
  getUser,
  createUser,
  generateSecretChallenge,
  addChallengeToDB,
  getChallenge,
  addCredentialsForUser,
  deleteChallengeFromDB
} = require("./helpers");

/**
 * Register user
 * @param {object} req The request object
 * @param {object} res The response object
 */
async function getUsersHandler(req, res) {
  try {
    const users = await getUsers();
    res.status(200).json({
      message: "Users successfully fetched",
      users
    });
  } catch (error) {
    res.status(401).json({
      message: "An error occurred while getting the users",
      error: error.message
    });
  }
}

/**
 * @param {object} req The request object
 * @param {object} res The response object
 */
async function getUserChallenge(req, res) {
  try {
    const userEmail = req.params.userEmail;
    const challenge = generateSecretChallenge();
    addChallengeToDB(userEmail, challenge);

    res.status(201).json({
      message: "Secret Challenge created",
      challenge
    });
  } catch (error) {
    res.status(401).json({
      message: "Challenge not created",
      error: error.message
    });
  }
}

/**
 * Register user
 * @param {object} req The request object
 * @param {object} res The response object
 */
async function registerHandler(req, res) {
  const { server } = await import("@passwordless-id/webauthn");
  const { email, registration } = req.body;

  const challengeFromDB = await getChallenge(email);
  const challengeKeyFromDB = challengeFromDB[0].challengeKey;

  const expected = {
    challenge: String(challengeKeyFromDB),
    origin: "http://localhost:3000"
  };

  const registrationParsed = await server.verifyRegistration(
    registration,
    expected
  );

  const credentials = registrationParsed.credential;

  try {
    let user = await getUser(email);
    if (user.length > 0) {
      addCredentialsForUser(user.id, credentials);
    } else {
      user = await createUser(email, credentials, "admin");
    }

    if (!user) {
      res.status(401).json({
        message: "User not successful created",
        error: error.message
      });
    }

    await deleteChallengeFromDB(challengeFromDB[0]);

    res.status(201).json({
      message: "User successfully registered"
    });
  } catch (error) {
    res.status(401).json({
      message: "User not successful registered",
      error: error.message
    });
  }
}

/**
 * Login user
 * @param {object} req The request object
 * @param {object} res The response object
 */
async function loginHandler(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "email or Password not present"
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        message: "Login not successful",
        error: "User not found"
      });
    } else {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      // comparing password needs to be changed
      if (isPasswordCorrect) {
        // const maxAge = 3 * 60 * 60;

        res.status(201).json({
          message: "User successfully Logged in",
          user: user._id
        });
      } else {
        res.status(400).json({ message: "Login not successful" });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message
    });
  }
}

/**
 * Updates a user
 * @param {object} req The request object
 * @param {object} res The response object
 */
async function updateHandler(req, res) {
  const { newEmail, id } = req.body;
  // Verifying if role and id is present

  try {
    const user = await User.findById(id);
    user.email = newEmail;
    user.save();
    res.status(200).json({ message: "email updated successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "An error occurred", error: error.message });
  }
}

/**
 * Deletes a user
 * @param {object} req The request object
 * @param {object} res The response object
 */
async function deleteHandler(req, res) {
  const { id } = req.body;
  await User.findById(id)
    .then((user) => user.deleteOne())
    .then((user) =>
      res.status(201).json({ message: "User successfully deleted", user })
    )
    .catch((error) =>
      res
        .status(400)
        .json({ message: "An error occurred", error: error.message })
    );
}

module.exports = {
  registerHandler,
  loginHandler,
  updateHandler,
  deleteHandler,
  getUsersHandler,
  getUserChallenge
};
