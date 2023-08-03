const Mongoose = require("mongoose");
const ChallengeSchema = new Mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  challengeKey: {
    type: String,
    unique: true,
    required: true
  }
});

const Challenge = Mongoose.model("challenge", ChallengeSchema);
module.exports = Challenge;
