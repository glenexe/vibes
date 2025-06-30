require("express-async-errors"); // for handling async errors and throwing them to the error handler
require("dotenv").config(); //load environment variables from .env file

//requiring  Libraries
const express = require("express"); //for creating server
const cookieparser = require("cookie-parser"); //for parsing cookies
const { v2: cloudinary } = require("cloudinary"); //for uploading images to cloudinary
const cors = require("cors");
const { app, server } = require("./ServerConfig/server.config"); //requiring our configured server

//requiring Routes
const authroutes = require("./Routes/auth.routes"); //importing auth routes
const itemroutes = require("./Routes/item.routes"); //importing item routes
const claimroutes = require("./Routes/claim.routes"); //importing claim routes
const questionroutes = require("./Routes/questions.routes"); //importing question routes
const disputeroutes = require("./Routes/disputes.routes"); // importing the dispute controller
const notificationroutes = require("./Routes/notification.routes");

// requiring middlewares

const VerificationGuard = require("./Middleware/Verification.guard"); //importing the email verification guard to protect routes

const ErrorHandler = require("./Middleware/ErrorHandler"); //importing the error handler middleware

//requiring the jobs middleware
const Jobs = require("./Services/Jobs/Jobs"); //importing the jobs middleware

// Database connection
const ConnectDb = require("./Dbconnection/Connect"); //importing the database connection file
//middleware

// middleware configuration
//cors middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true, // Allow cookies, if needed
  })
);
app.use(express.json()); //parse incoming JSON requests
app.use(cookieparser()); //parse cookies from incoming requests

//routes
app.use("/api/v1/auth", authroutes); //using auth routes
app.use("/api/v1/items", VerificationGuard.jwtVerifyGuard, itemroutes); //using item routes
app.use("/api/v1/claims", VerificationGuard.jwtVerifyGuard, claimroutes); //using claim routes
app.use("/api/v1/questions", VerificationGuard.jwtVerifyGuard, questionroutes); //using question routes
app.use("/api/v1/disputes", VerificationGuard.jwtVerifyGuard, disputeroutes);
app.use(
  "/api/v1/notifications",
  VerificationGuard.jwtVerifyGuard,
  notificationroutes
);

//error handler middleware
app.use(ErrorHandler.HandleError); //using the error handler middleware

const port = process.env.PORT || 7000; //loading port from environmnet variables

const StartServer = async () => {
  try {
    await ConnectDb.connect(process.env.MONGO_URI); //connecting to the database
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`); //logging the server start message
      Jobs.clearUnverifiedUsers();
    });
  } catch (error) {
    console.log(error.message); //logging the error message
  }
};
StartServer(); //calling the function to start the server
