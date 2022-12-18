if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const http = require('http');
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const socketEvents = require("./socketEvents");
const cors = require("cors");



mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error :")); // testing db connected or not
db.once("open", () => {
  console.log("---------------DataBase Connected -------------- ");
});



const server = http.createServer(app);
app.use(
  cors({
    origin: "*",
    // origin: ['http://localhost', 'http://www.wizegrid.com', 'https://www.wizegrid.com', 'http://wizegrid.com', 'https://wizegrid.com', 'http://www.wizegrid.netlify.app', 'https://www.wizegrid.netlify.app', 'http://wizegrid.netlify.app', 'https://wizegrid.netlify.app'],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    allowedHeaders: "*",
    // allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'Authorization'],
    credentials: true,
  })
);




















//==================== core policy ======================================
// app.use(function (req, res, next) {
//   res.header(
//     "Access-Control-Allow-Origin",
//     process.env.ALLOW_CLIENT.split(",")
//   );
//   res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
//   );
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

//====================== running port ==============
const port = process.env.PORT || 5000;


server.listen(port, () => console.log(`Server has started. http://localhost:${port}/`));

// const server = app.listen(port, () => {
//   console.log("Server Started.........." + `http://localhost:${port}/`);
// });

//============================== connecting socket.io events 

const io = require("socket.io")(server, {
  cors: {
    origin: '*',
  },
});
socketEvents(io);

//==================================     middleware
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

//======================================  routes
const userRoute = require("./routes/user");
const authRoute = require("./routes/authenticator");
const postRoute = require("./routes/Post");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/Message");
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/post", postRoute);
app.use("/conversation", conversationRoute);
app.use("/messages", messageRoute);



//==============================  port
// it can handle all kinds of error in my app any where it is trown
app.use((error, req, res, next) => {
  console.log(error)
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
