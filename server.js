// server.js (Node + Express + Socket.IO)
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.use("/static", express.static(path.join(__dirname, "static"))); // optional

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("chat message", (data) => socket.broadcast.emit("chat message", data));

  socket.on("offer", (offer) => socket.broadcast.emit("offer", offer));
  socket.on("answer", (answer) => socket.broadcast.emit("answer", answer));
  socket.on("ice-candidate", (candidate) => socket.broadcast.emit("ice-candidate", candidate));

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server on ${PORT}`));
