const {
  registerHandler,
  loginHandler,
  updateHandler,
  deleteHandler,
  getUsersHandler,
  getUserChallenge,
  getUserChallengeLogin,
  isUserRegistered
} = require("./handlers");

exports.register = async (req, res, next) => {
  registerHandler(req, res);
};

exports.getUsers = async (req, res, next) => {
  getUsersHandler(req, res);
};
exports.isExistingUser = async (req, res, next) => {
  isUserRegistered(req, res);
};
exports.getChallenge = async (req, res, next) => {
  getUserChallenge(req, res);
};
exports.getChallengeLogin = async (req, res, next) => {
  getUserChallengeLogin(req, res);
};

exports.login = async (req, res, next) => {
  loginHandler(req, res);
};

exports.update = async (req, res, next) => {
  updateHandler(req, res);
};

exports.deleteUser = async (req, res, next) => {
  deleteHandler(req, res);
};
