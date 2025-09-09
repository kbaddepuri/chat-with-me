const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve React build
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("chat message", (msg) => socket.broadcast.emit("chat message", msg));
  socket.on("offer", (offer) => socket.broadcast.emit("offer", offer));
  socket.on("answer", (answer) => socket.broadcast.emit("answer", answer));
  socket.on("ice-candidate", (candidate) => socket.broadcast.emit("ice-candidate", candidate));

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
