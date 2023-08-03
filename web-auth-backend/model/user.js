const Mongoose = require("mongoose");
const UserSchema = new Mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  role: {
    type: String,
    default: "Basic",
    required: true
  },
  credentials: {
    type: Array,
    unique: true,
    required: true
  }
});

const User = Mongoose.model("user", UserSchema);
module.exports = User;
