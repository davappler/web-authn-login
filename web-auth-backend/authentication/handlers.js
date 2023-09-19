require("dotenv").config();

const {
  getUsers,
  getUser,
  createUser,
  generateSecretChallenge,
  addChallengeToDB,
  getChallenge,
  addCredentialsForUser,
  deleteChallengeFromDB,
  getCredentialFromDb,
  generateJwtToken
} = require("./helpers");

/**
 * Register user
 * @param {object} req The request object
 * @param {object} res The response object
 */
async function isUserRegistered(req, res) {
  const userEmail = req.params.userEmail;
  const user = await getUser(userEmail);
  if (user.length > 0) {
    res.status(200).json({
      isExistingUser: true
    });
  } else {
    res.status(200).json({
      isExistingUser: false
    });
  }
}
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
 * @param {object} req The request object
 * @param {object} res The response object
 */
async function getUserChallengeLogin(req, res) {
  try {
    const userEmail = req.params.userEmail;

    const user = await getUser(userEmail);

    if (user === null) {
      res.status(401).json({
        message: "Login not successful",
        error: "User not found"
      });
    } else {
      const challenge = generateSecretChallenge();
      await addChallengeToDB(userEmail, challenge);

      const credential = await getCredentialFromDb(userEmail);

      res.status(201).json({
        message: "Secret Challenge created",
        authData: {
          challenge: challenge,
          credentialID: credential.id
        }
      });
    }
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

  let user = await getUser(email);

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
    if (user.length > 0) {
      addCredentialsForUser(user[0].id, credentials);
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
    const maxAge = 3 * 60 * 60; // This is in seconds => 3*60*60 is 3 hours
    const token = generateJwtToken(user, maxAge);

    res.status(201).json({
      message: "User successfully registered",
      status: 200,
      token
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
  const { server } = await import("@passwordless-id/webauthn");
  const { email, authentication } = req.body;

  const challengeFromDB = await getChallenge(email);
  const challengeKeyFromDB = challengeFromDB[0].challengeKey;

  if (!email || !authentication) {
    return res.status(400).json({
      message: "Can not authenticate"
    });
  }

  try {
    const user = await getUser(email);
    if (!user) {
      await deleteChallengeFromDB(challengeFromDB[0]);
      res.status(401).json({
        message: "Login not successful",
        error: "User not found"
      });
    } else {
      const credentialKey = await getCredentialFromDb(email);
      const expected = {
        challenge: challengeKeyFromDB,
        origin: "http://localhost:3000",
        userVerified: true,
        counter: -1
      };

      await server.verifyAuthentication(
        authentication,
        credentialKey,
        expected
      );

      await deleteChallengeFromDB(challengeFromDB[0]);
      const maxAge = 3 * 60 * 60;
      const token = generateJwtToken(user, maxAge);

      res.status(201).json({
        message: "User successfully Logged in",
        status: 200,
        token
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message
    });
  }
}

module.exports = {
  registerHandler,
  loginHandler,
  getUsersHandler,
  getUserChallenge,
  getUserChallengeLogin,
  isUserRegistered
};

// ----- Extra code down here --------
// /**
//  * Updates a user
//  * @param {object} req The request object
//  * @param {object} res The response object
//  */
// async function updateHandler(req, res) {
//   const { newEmail, id } = req.body;

//   try {
//     const user = await User.findById(id);
//     user.email = newEmail;
//     user.save();
//     res.status(200).json({ message: "email updated successfully" });
//   } catch (error) {
//     res
//       .status(400)
//       .json({ message: "An error occurred", error: error.message });
//   }
// }

// /**
//  * Deletes a user
//  * @param {object} req The request object
//  * @param {object} res The response object
//  */
// async function deleteHandler(req, res) {
//   const { id } = req.body;
//   await User.findById(id)
//     .then((user) => user.deleteOne())
//     .then((user) =>
//       res.status(201).json({ message: "User successfully deleted", user })
//     )
//     .catch((error) =>
//       res
//         .status(400)
//         .json({ message: "An error occurred", error: error.message })
//     );
// }
