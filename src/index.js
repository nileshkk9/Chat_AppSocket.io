const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const { generateMessage: gm } = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require("./utils/user");

const app = express();
//done behind the scene by express
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

io.on("connection", socket => {
  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      username,
      room
    });

    if (error) {
      callback(error);
    }

    socket.join(user.room);

    socket.emit("message", gm("Admin", "Welcome"));
    socket.broadcast
      .to(user.room)
      .emit("message", gm("Admin", `${user.username} has joined the room`));

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room)
    });
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    // console.log(user);
    io.to(user.room).emit("message", gm(user.username, message));
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", gm("Admin", `${user} has left!`));
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });

  socket.on("sendLocation", (pos, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      gm(
        user.username,
        `https://google.com/maps?q=${pos.latitude},${pos.longitude}`
      )
    );
    callback();
  });
});

//server.listen not app.listen
server.listen(port, () => {
  console.log("server running on port: " + port);
});
