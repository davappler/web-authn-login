const express = require("express");
const connectDB = require("./db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const { adminAuth } = require("./middleware/admin/auth");
// const { userAuth } = require("./middleware/user/auth");

// Connecting the Database
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
const PORT = 5001;

app.use("/api/auth", require("./authentication/routes"));
// app.get("/admin", (req, res) => res.send("Admin Route"));
// app.get("/basic", (req, res) => res.send("User Route"));

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
);
// Handling Error
process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
