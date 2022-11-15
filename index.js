const express = require("express");
require("./app/config/mongodb");
require("dotenv").config();

const cors = require("cors");
// require("./app/controller/account.controller");
//importing the routes
const adminRouter = require("./app/route/main.route");

//creating the server
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(adminRouter);

//listening the server
app.listen(process.env.PORT, () => {
  console.log("server is running on port " + process.env.PORT);
});
