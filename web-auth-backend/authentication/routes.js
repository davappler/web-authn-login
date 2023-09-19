const express = require("express");
const router = express.Router();
const {
  register,
  login,
  update,
  deleteUser,
  getUsers,
  getChallenge,
  getChallengeLogin,
  isExistingUser
} = require("./repo");
// const { adminAuth } = require("../middleware/admin/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update").put(update);
router.route("/deleteUser").delete(deleteUser);
router.route("/users").get(getUsers);
router.route("/request-challenge/:userEmail").get(getChallenge);
router.route("/existing-user/:userEmail").get(isExistingUser);
router.route("/request-challenge-login/:userEmail").get(getChallengeLogin);
module.exports = router;
