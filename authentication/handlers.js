const bcrypt = require("bcryptjs");
const User = require("../model/user");
require("dotenv").config();

const { createUser } = require("./helpers");

/**
 * Register user
 * @param {object} req The request object
 * @param {object} res The response object
 */
async function registerHandler(req, res) {
  const { email, password } = req.body;
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    // create user should also store the challenge token
    const user = await createUser(email, hashedPassword, "admin");
    // const maxAge = 3 * 60 * 60;postm

    res.status(201).json({
      message: "User successfully created",
      user
    });
  } catch (error) {
    res.status(401).json({
      message: "User not successful created",
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
  deleteHandler
};
