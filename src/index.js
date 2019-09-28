const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
//done behind the scene by express
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

io.on("connection", socket => {
  socket.emit("message", "Welcome");
  socket.broadcast.emit("message", "New user connected");

  socket.on("sendMessage", (message, callback) => {
    io.emit("message", message);
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left");
  });

  socket.on("sendLocation", (pos, callback) => {
    io.emit(
      "message",
      `https://google.com/maps?q=${pos.latitude},${pos.longitude}`
    );
    callback();
  });
});

//server.listen not app.listen
server.listen(port, () => {
  console.log("server running on port: " + port);
});
