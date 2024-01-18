//Dependencies
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/common/errorHandler");
const loginRouter = require("./router/loginRouter");
const userRouter = require("./router/userRouter");
const inboxRouter = require("./router/inboxRouter");
const http = require("http");
const moment = require("moment");

//Basic configuration
const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser(process.env.COOKIE_SECRET));
const server = http.createServer(app);
const io = require("socket.io")(server);
global.io = io;
app.locals.moment = moment;

//MongoDB database connection
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("MONGODB DATABASE CONNECTED");
  })
  .catch((err) => {
    console.log(err.message);
  });

//Router setup
app.use("/", loginRouter);
app.use("/users", userRouter);
app.use("/inbox", inboxRouter);

//404 notfound handler
app.use(notFoundHandler);

//Common error handler
app.use(errorHandler);

//Server starting
server.listen(process.env.PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT}`);
});
