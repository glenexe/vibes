//server configuration file

// Importing required modules
const http = require("http");
const socketIo = require("socket.io");
const express = require("express");

//creating the server
//creating an instance of express
const app = express();
//creating a httpsrver and passing the express app to it
const server = http.createServer(app);

//addign socket connection to the server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
module.exports = { app, server, io };
