const express = require("express");
const router = express.Router();
const { register, login, update, deleteUser } = require("./repo");
// const { adminAuth } = require("../middleware/admin/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update").put(update);
router.route("/deleteUser").delete(deleteUser);
module.exports = router;
