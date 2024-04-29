const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

let socketsConected = new Set();

io.on("connection", onConnected);

function onConnected(socket) {
  console.log("Socket connected", socket.id);
  socketsConected.add(socket.id);
  io.emit("clients-total", socketsConected.size);

  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
    socketsConected.delete(socket.id);
    io.emit("clients-total", socketsConected.size);
  });

  socket.on("message", (data) => {
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
}

server.listen(3333, () => console.log("🚀🚀🚀"));
