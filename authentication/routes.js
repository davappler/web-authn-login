const express = require("express");
const router = express.Router();
const {
  register,
  login,
  update,
  deleteUser,
  getUsers,
  getChallenge
} = require("./repo");
// const { adminAuth } = require("../middleware/admin/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update").put(update);
router.route("/deleteUser").delete(deleteUser);
router.route("/users").get(getUsers);
router.route("/request-challenge").get(getChallenge);
module.exports = router;
