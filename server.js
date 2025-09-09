const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const CHAT_PASSWORD = process.env.CHAT_PASSWORD || "secret123"; // set your own

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  const password = socket.handshake.query.password;
  if (password !== CHAT_PASSWORD) {
    socket.emit("auth_error", "Invalid password ❌");
    socket.disconnect();
    return;
  }

  socket.emit("auth_success");
  console.log("✅ user joined chat");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
