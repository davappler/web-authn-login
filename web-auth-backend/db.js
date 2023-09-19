const Mongoose = require("mongoose");
// const mongoUrl = "mongodb://mongo:27017/web-authn"; // For docker
const mongoUrl = "mongodb://localhost:27017/web-authn"; // For local running
const connectDB = async () => {
  await Mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("MongoDB Connected");
};
module.exports = connectDB;
